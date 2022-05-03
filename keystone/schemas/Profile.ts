import { list } from "@keystone-6/core";
import {
  checkbox,
  decimal,
  integer,
  relationship,
  text,
  timestamp,
} from "@keystone-6/core/fields";

const createProfile = async ({ context, item }) => {
  const profile = await context.query.Profile.findOne({
    where: {
      id: item?.id,
    },
    query: `id 
    activity {
      id
    }
    duos {
      id
    }
    championWinrate {
      id
    }
    player { id puuid summonerName
    endOfGameStats 
      { id kills deaths assists win totalMinionsKilled 
        totalDamageDealtToChampions timePlayed totalTimeSpentDead 
        championName goldEarned goldSpent 
        spell1Casts spell2Casts spell3Casts spell4Casts }
    teams {
      id win players
            { id puuid summonerName }
          game
            { id gameStartTimestamp }
    } }`,
  });
  await context.query.Activity.deleteMany({
    where: profile?.activity,
  });
  await context.query.Duo.deleteMany({
    where: profile?.duos,
  });
  await context.query.ChampionWinrate.deleteMany({
    where: profile?.championWinrate,
  });
  const player = profile.player;
  const stats = player.endOfGameStats.reduce(
    (acc, stat) => {
      acc.kills += stat.kills;
      acc.deaths += stat.deaths;
      acc.assists += stat.assists;
      acc.win += stat.win;
      acc.timePlayed += stat.timePlayed;
      acc.totalTimeSpentDead += stat.totalTimeSpentDead;
      acc.goldEarned += stat.goldEarned;
      acc.cs += stat.totalMinionsKilled;
      acc.damage += stat.totalDamageDealtToChampions;
      return acc;
    },
    {
      kills: 0,
      deaths: 0,
      assists: 0,
      win: 0,
      timePlayed: 0,
      totalTimeSpentDead: 0,
      goldEarned: 0,
      goldSpent: 0,
      cs: 0,
      damage: 0,
    }
  );
  console.dir(player.teams);
  const activity = player.teams.reduce((acc, team) => {
    console.dir(team);
    if (!team.game) {
      return acc;
    }
    const gameStart = new Date(parseInt(team.game.gameStartTimestamp));
    console.dir(gameStart);
    const day = gameStart.getDay();
    const month = gameStart.getMonth();
    const year = gameStart.getFullYear();
    if (acc?.[year]?.[month]?.[day]) {
      acc[year][month][day] += 1;
    } else {
      acc[year] = acc[year] || {};
      acc[year][month] = acc[year][month] || {};
      acc[year][month][day] = 1;
    }
    return acc;
  }, {});
  console.log(activity);

  const activityArray = Object.entries(activity)
    .map(([year, months]) => {
      return Object.entries(months).map(([month, days]) => {
        return Object.entries(days).map(([day, games]) => {
          return {
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day),
            gamesPlayed: parseInt(games),
          };
        });
      });
    })
    .flat()
    .flat();

  const champWinrate = player.endOfGameStats.reduce((acc, stat) => {
    if (acc[stat.championName]) {
      if (stat.win) {
        acc[stat.championName].wins += 1;
      }
      acc[stat.championName].games += 1;
      acc[stat.championName].spell1Casts += stat.spell1Casts;
      acc[stat.championName].spell2Casts += stat.spell2Casts;
      acc[stat.championName].spell3Casts += stat.spell3Casts;
      acc[stat.championName].spell4Casts += stat.spell4Casts;
    } else {
      acc[stat.championName] = {
        wins: stat.win ? 1 : 0,
        games: 1,
        spell1Casts: stat.spell1Casts,
        spell2Casts: stat.spell2Casts,
        spell3Casts: stat.spell3Casts,
        spell4Casts: stat.spell4Casts,
      };
    }

    return acc;
  }, {});
  const champWinrateArray = Object.entries(champWinrate).map(
    ([champ, record]) => {
      return { ...record, champion: champ };
    }
  );

  const duos = player.teams.reduce((acc, team) => {
    for (let i = 0; i < team.players.length; i++) {
      const summoner = team.players[i];
      if (summoner.summonerName === player.summonerName) {
      } else if (acc?.[summoner.summonerName]) {
        if (team.win) {
          acc[summoner.summonerName].wins += 1;
        } else {
          acc[summoner.summonerName].losses += 1;
        }
      } else {
        acc[summoner.summonerName] = {
          wins: team.win ? 1 : 0,
          losses: team.win ? 0 : 1,
        };
      }
    }
    return acc;
  }, {});
  const duosArray = Object.entries(duos).map(([summonerName, record]) => {
    return {
      name: summonerName,
      winrate:
        record.losses === 0
          ? "1"
          : (record.wins / (record.wins + record.losses)).toFixed(2).toString(),
      ...record,
    };
  });

  await context.query.Profile.updateOne({
    where: { id: item?.id },
    data: {
      update: false,
      lastUpdate: new Date().toISOString(),
      kills: stats.kills,
      deaths: stats.deaths,
      assists: stats.assists,
      kda: ((stats.kills + stats.assists) / stats.deaths).toFixed(2).toString(),
      winRate: ((stats.win / player.endOfGameStats.length) * 100)
        .toFixed(2)
        .toString(),
      csPerMinute: (stats.cs / (stats.timePlayed / 60)).toFixed(2).toString(),
      damagePerMinute: ((stats.damage / stats.timePlayed) * 60)
        .toFixed()
        .toString(),
      goldPerMinute: (stats.goldEarned / (stats.timePlayed / 60))
        .toFixed()
        .toString(),
      killsPerMinute: (stats.kills / (stats.timePlayed / 60))
        .toFixed(2)
        .toString(),
      averageGameTime: (
        stats.timePlayed / player.endOfGameStats.length
      ).toString(),
      averageTimeSpentDead: (stats.totalTimeSpentDead / stats.timePlayed)
        .toFixed(2)
        .toString(),
      totalGameTime: stats.timePlayed.toString(),
      // Use the time each game started to figure out games played each day
      activity: { create: activityArray },
      championWinrate: { create: champWinrateArray },
      duos: { create: duosArray },
    },
  });
};

export const Profile = list({
  fields: {
    update: checkbox({
      defaultValue: true,
      hooks: {
        afterOperation: async ({ fieldKey, context, inputData, item }) => {
          if (fieldKey === "update" && inputData?.update) {
            await createProfile({ context, item });
            const player = await context.query.Player.findMany({
              where: {
                profile: { id: { equals: item?.id } },
              },
              query: `id puuid`,
            });
            const si = await context.query.SeedIdentifier.findMany({
              where: {
                identifier: {
                  equals: player[0].puuid,
                },
              },
            });
            if (si.length > 0) {
              await context.query.SeedIdentifier.updateOne({
                where: { id: si[0].id },
                data: {
                  priority: true,
                  retrieved: false,
                },
              });
            } else {
              await context.query.SeedIdentifier.createOne({
                data: {
                  identifier: player[0].puuid,
                  type: "idPUUID",
                  priority: true,
                  retrieved: false,
                },
              });
            }
          }
        },
      },
    }),
    player: relationship({ ref: "Player.profile", many: false }),
    lastUpdate: timestamp({
      defaultValue: { kind: "now" },
      validation: {
        isRequired: true,
      },
    }),
    kills: integer(),
    deaths: integer(),
    assists: integer(),
    kda: text(), // replace with decimal
    winRate: text(), // replace with decimal
    csPerMinute: text(), // replace with decimal
    damagePerMinute: text(), // replace with decimal
    killsPerMinute: text(), // replace with decimal
    goldPerMinute: text(), // replace with decimal
    averageGameTime: text(), // replace with decimal
    averageTimeSpentDead: text(), // replace with decimal
    totalGameTime: text(),
    activity: relationship({ ref: "Activity.profile", many: true }),
    championWinrate: relationship({
      ref: "ChampionWinrate.profile",
      many: true,
    }),
    duos: relationship({ ref: "Duo.profile", many: true }),
  },
  hooks: {
    afterOperation: async ({ context, item, operation }) => {
      if (operation === "create") {
        await createProfile({ context, item });
      }
    },
  },
});

export const Activity = list({
  fields: {
    profile: relationship({ ref: "Profile.activity" }),
    month: integer(),
    year: integer(),
    day: integer(),
    gamesPlayed: integer(),
  },
});

export const Duo = list({
  fields: {
    profile: relationship({ ref: "Profile.duos" }),
    name: text(),
    wins: integer(),
    losses: integer(),
    winrate: text(), // replace with decimal
  },
});

export const ChampionWinrate = list({
  fields: {
    profile: relationship({ ref: "Profile.championWinrate" }),
    champion: text(),
    wins: integer(),
    games: integer(),
    spell1Casts: integer(),
    spell2Casts: integer(),
    spell3Casts: integer(),
    spell4Casts: integer(),
  },
});
