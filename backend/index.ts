import { PrismaClient } from "@prisma/client";
import { LolApi, Constants } from "twisted";
import _ from "lodash";

const prisma = new PrismaClient();
const riotKey = process.env.RIOT_KEY || "";
const api = new LolApi({
  rateLimitRetry: true,
  rateLimitRetryAttempts: 5,
  key: riotKey,
});

const getSummonerDataFromRiot = async ({ id, constantsData }) => {
  if (id.type === "idSummoner") {
    const summonerResponse = await api.Summoner.getById(
      id.identifier,
      Constants.Regions.AMERICA_NORTH
    ).catch((err) => {
      console.dir(id);
      console.error(err);
      return;
    });
    const summoner = summonerResponse.response;
    handleRetrievedSummoner({ id, summoner, constantsData });
  } else if (id.type === "idPUUID") {
    const summonerResponse = await api.Summoner.getByPUUID(
      id.identifier,
      Constants.Regions.AMERICA_NORTH
    ).catch((err) => {
      console.dir(id);
      console.error(err);
      return;
    });
    const summoner = summonerResponse.response;
    handleRetrievedSummoner({ id, summoner, constantsData });
  } else if (id.type === "idSummonerName") {
    const summonerResponse = await api.Summoner.getByName(
      id.identifier,
      Constants.Regions.AMERICA_NORTH
    ).catch((err) => {
      console.dir(id);
      console.error(err);
      return;
    });
    const summoner = summonerResponse.response;
    handleRetrievedSummoner({ id, summoner, constantsData });
  }
};

const handleRetrievedSummoner = async ({ id, summoner, constantsData }) => {
  try {
    let data = {
      accountId: summoner.accountId,
      puuid: summoner.puuid,
      summonerName: summoner.name,
      profileIconId: summoner.profileIconId,
      revisionDate: summoner.revisionDate.toString(),
      summonerLevel: summoner.summonerLevel,
      summonerId: summoner.id,
      platformId: "NA1",
    };

    const summonerToUpdate = await prisma.player.findFirst({
      where: {
        OR: [
          { puuid: summoner?.puuid },
          { summonerId: summoner.id },
          { accountId: summoner?.accountId },
        ],
      },
    });

    if (summonerToUpdate) {
      await prisma.player.upsert({
        where: {
          id: summonerToUpdate.id,
        },
        update: {
          ...data,
        },
        create: {
          ...data,
        },
      });
    }

    let matchIds = [];
    while (summoner.puuid !== null && summoner.puuid !== undefined) {
      const newMatchIdsRequest = await api.MatchV5.list(
        summoner.puuid,
        Constants.RegionGroups.AMERICAS,
        {
          queue: 420,
          count: 100,
          start: matchIds.length,
          startTime: constantsData.startTime.slice(0, -4),
        }
      ).catch((err) => {
        console.error(err);
      });
      const newMatchIds = newMatchIdsRequest.response;
      process.stdout.write(
        `${summoner?.puuid} new matches: ${newMatchIds?.length}`
      );
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      if (!newMatchIds || newMatchIds.length === 0) {
        break;
      }
      matchIds = matchIds.concat(newMatchIds);
    }
    while (matchIds.length > 0) {
      await createSeedIdentifiers({
        data: matchIds.splice(0, 50),
        type: "idMatch",
        priority: id.priority,
      });
    }
  } catch (err) {
    console.dir(id);
    console.error(err);
    return;
  }
};

const getMatchDataFromRiot = async ({ id, constantsData }) => {
  let matchRequest = await api.MatchV5.get(
    id.identifier,
    Constants.RegionGroups.AMERICAS
  ).catch((err) => {
    console.error(err);
  });
  const match = matchRequest.response;
  try {
    if (match?.info.gameVersion.startsWith(constantsData.currentSeason)) {
      await createSeedIdentifiers({
        data: match.metadata.participants,
        type: "idPUUID",
      });
      const players = await prisma.player.findMany({
        where: {
          OR: match.metadata.participants.map((participant) => ({
            puuid: participant.puuid,
          })),
        },
      });

      // get summoner data for any player that is not in the database
      const participants = match.metadata.participants;

      const participantsNotInDatabase = participants.filter(
        (participant) =>
          !players.find((player) => player.puuid === participant.puuid)
      );

      for (let participant of participantsNotInDatabase) {
        await getSummonerDataFromRiot({
          id: {
            type: "idPUUID",
            identifier: participant,
            priority: false,
          },
          constantsData: constantsData,
        });
      }
      const isGameInDatabase = await prisma.game.findFirst({
        where: { matchId: match.metadata.matchId },
      });
      if (!!isGameInDatabase) return;

      const game = await prisma.game.create({
        data: {
          matchId: match.metadata.matchId.toString(),
          gameId: match.info.gameId.toString(),
          gameCreation: match.info.gameCreation.toString(),
          gameStartTimestamp: match.info.gameStartTimestamp.toString(),
          gameEndTimestamp: match.info.gameEndTimestamp.toString(),
          duration: match.info.gameDuration,
          start: match.info.gameCreation.toString(),
          gameVersion: match.info.gameVersion.toString(),
          tournament: match.info.tournamentCode,
          platformId: match.info.platformId.toString(),
          blueTeam: {
            create: {
              teamId: match.info.teams.filter((p) => p.teamId === 100)[0]
                .teamId,
              win: match.info.teams.filter((p) => p.teamId === 100)[0].win,
              teamMatchId: `${match.metadata.matchId}_blue`,
              players: {
                connectOrCreate: match.info.participants
                  .filter((p) => p.teamId === 100)
                  .map((p) => ({
                    where: {
                      puuid: p.puuid,
                    },
                    create: {
                      puuid: p.puuid,
                    },
                  })),
              },
              pickBan: {
                create: match.info.teams
                  .filter((p) => p.teamId === 100)[0]
                  .bans.map((ban) => {
                    return {
                      championId: ban.championId,
                      pickTurn: ban.pickTurn,
                    };
                  }),
              },
              objectives: {
                create: Object.keys(
                  match.info.teams.filter((p) => p.teamId === 100)[0].objectives
                ).map((key) => {
                  return {
                    first: match.info.teams.filter((p) => p.teamId === 200)[0]
                      .objectives[key].first,
                    kills: match.info.teams.filter((p) => p.teamId === 200)[0]
                      .objectives[key].kills,
                    type: key,
                  };
                }),
              },
            },
          },
          redTeam: {
            create: {
              teamId: match.info.teams.filter((p) => p.teamId === 200)[0]
                .teamId,
              win: match.info.teams.filter((p) => p.teamId === 200)[0].win,
              teamMatchId: `${match.metadata.matchId}_red`,
              players: {
                connectOrCreate: match.info.participants
                  .filter((p) => p.teamId === 200)
                  .map((p) => ({
                    where: {
                      puuid: p.puuid,
                    },
                    create: {
                      puuid: p.puuid,
                    },
                  })),
              },
              pickBan: {
                create: match.info.teams
                  .filter((p) => p.teamId === 200)[0]
                  .bans.map((ban) => {
                    return {
                      championId: ban.championId,
                      pickTurn: ban.pickTurn,
                    };
                  }),
              },
              objectives: {
                create: Object.keys(
                  match.info.teams.filter((p) => p.teamId === 200)[0].objectives
                ).map((key) => {
                  return {
                    first: match.info.teams.filter((p) => p.teamId === 200)[0]
                      .objectives[key].first,
                    kills: match.info.teams.filter((p) => p.teamId === 200)[0]
                      .objectives[key].kills,
                    type: key,
                  };
                }),
              },
            },
          },
        },
      });

      await prisma.team.update({
        where: {
          teamMatchId: `${match.metadata.matchId}_blue`,
        },
        data: {
          game: {
            connect: {
              id: game.id,
            },
          },
        },
      });
      await prisma.team.update({
        where: {
          teamMatchId: `${match.metadata.matchId}_red`,
        },
        data: {
          game: {
            connect: {
              id: game.id,
            },
          },
        },
      });

      await Promise.all(
        match.info.participants.map(async (participant) => {
          await prisma.playerEndOfGameStat.create({
            data: {
              player: {
                connect: {
                  puuid: participant.puuid,
                },
              },
              game: {
                connect: {
                  matchId: match.metadata.matchId,
                },
              },
              perks: {
                create: {
                  runeStyle: {
                    create: participant.perks.styles.map((style) => {
                      return {
                        selection: {
                          create: style.selections.map((selection) => {
                            return {
                              perk: selection.perk,
                              var1: selection.var1,
                              var2: selection.var2,
                              var3: selection.var3,
                            };
                          }),
                        },
                        description: style.description,
                        style: style.style,
                      };
                    }),
                  },
                  defense: participant.perks.statPerks.defense,
                  flex: participant.perks.statPerks.flex,
                  offense: participant.perks.statPerks.offense,
                },
              },
              assists: participant.assists,
              baronKills: participant.baronKills,
              bountyLevel: participant.bountyLevel,
              championExperience: participant.champExperience,
              championLevel: participant.champLevel,
              championId: participant.championId,
              championName: participant.championName,
              championTransform: participant.championTransform,
              consumablesPurchased: participant.consumablesPurchased,
              damageDealtToBuildings: participant.damageDealtToBuildings,
              damageDealtToObjectives: participant.damageDealtToObjectives,
              damageDealtToTurrets: participant.damageDealtToTurrets,
              damageSelfMitigated: participant.damageSelfMitigated,
              deaths: participant.deaths,
              detectorWardsPlaced: participant.detectorWardsPlaced,
              doubleKills: participant.doubleKills,
              dragonKills: participant.dragonKills,
              firstBlood: participant.firstBloodKill,
              firstBloodAssist: participant.firstBloodAssist,
              firstTowerKill: participant.firstTowerKill,
              firstTowerAssist: participant.firstTowerAssist,
              gameEndedInEarlySurrender: participant.gameEndedInEarlySurrender,
              gameEndedInSurrender: participant.gameEndedInSurrender,
              goldEarned: participant.goldEarned,
              goldSpent: participant.goldSpent,
              individualPosition: participant.individualPosition,
              inhibitorKills: participant.inhibitorKills,
              inhibitorTakedowns: participant.inhibitorTakedowns,
              inhibitorsLost: participant.inhibitorsLost,
              item0: participant.item0,
              item1: participant.item1,
              item2: participant.item2,
              item3: participant.item3,
              item4: participant.item4,
              item5: participant.item5,
              item6: participant.item6,
              itemsPurchased: participant.itemsPurchased,
              killingSprees: participant.killingSprees,
              kills: participant.kills,
              lane: participant.lane,
              largestCriticalStrike: participant.largestCriticalStrike,
              largestKillingSpree: participant.largestKillingSpree,
              largestMultiKill: participant.largestMultiKill,
              longestTimeSpentLiving: participant.longestTimeSpentLiving,
              magicDamageDealt: participant.magicDamageDealt,
              magicDamageDealtToChampions:
                participant.magicDamageDealtToChampions,
              magicDamageTaken: participant.magicDamageTaken,
              neutralMinionsKilled: participant.neutralMinionsKilled,
              nexusKills: participant.nexusKills,
              nexusLost: participant.nexusLost,
              nexusTakedowns: participant.nexusTakedowns,
              objectivesStolen: participant.objectivesStolen,
              objectivesStolenAssists: participant.objectivesStolenAssists,
              participantId: participant.participantId,
              pentaKills: participant.pentaKills,
              physicalDamageDealt: participant.physicalDamageDealt,
              physicalDamageDealtToChampions:
                participant.physicalDamageDealtToChampions,
              physicalDamageTaken: participant.physicalDamageTaken,
              quadraKills: participant.quadraKills,
              riotIdName: participant.riotIdName,
              riotIdTagline: participant.riotIdTagline,
              role: participant.role,
              sightWardsBoughtInGame: participant.sightWardsBoughtInGame,
              spell1Casts: participant.spell1Casts,
              spell2Casts: participant.spell2Casts,
              spell3Casts: participant.spell3Casts,
              spell4Casts: participant.spell4Casts,
              summoner1Casts: participant.summoner1Casts,
              summoner1Id: participant.summoner1Id,
              summoner2Casts: participant.summoner2Casts,
              summoner2Id: participant.summoner2Id,
              summonerLevel: participant.summonerLevel,
              summonerName: participant.summonerName,
              teamEarlySurrendered: participant.teamEarlySurrendered,
              teamId: participant.teamId,
              teamPosition: participant.teamPosition,
              timeCCingOthers: participant.timeCCingOthers,
              timePlayed: participant.timePlayed,
              totalDamageDealt: participant.totalDamageDealt,
              totalDamageDealtToChampions:
                participant.totalDamageDealtToChampions,
              totalDamageShieldedOnTeammates:
                participant.totalDamageShieldedOnTeammates,
              totalDamageTaken: participant.totalDamageTaken,
              totalHeal: participant.totalHeal,
              totalHealsOnTeammates: participant.totalHealsOnTeammates,
              totalMinionsKilled: participant.totalMinionsKilled,
              totalTimeCCDealt: participant.totalTimeCCDealt,
              totalTimeSpentDead: participant.totalTimeSpentDead,
              totalUnitsHealed: participant.totalUnitsHealed,
              tripleKills: participant.tripleKills,
              trueDamageDealt: participant.trueDamageDealt,
              trueDamageDealtToChampions:
                participant.trueDamageDealtToChampions,
              trueDamageTaken: participant.trueDamageTaken,
              turretsKilled: participant.turretKills,
              turretTakedowns: participant.turretTakedowns,
              turretsLost: participant.turretsLost,
              unrealKills: participant.unrealKills,
              visionScore: participant.visionScore,
              visionWardsBoughtInGame: participant.visionWardsBoughtInGame,
              wardsKilled: participant.wardsKilled,
              wardsPlaced: participant.wardsPlaced,
              win: participant.win,
            },
          });
        })
      );
    } else if (match.info.gameCreation > constantsData.startTime) {
      let newConstantsData = await prisma.constant.update({
        where: { id: constantsData.id },
        data: {
          startTime: match.info.gameCreation.toString(),
        },
      });
      constantsData = newConstantsData.data;
    }
  } catch (error) {
    console.dir(id);
    console.error(error);
  }
};

const createSeedIdentifiers = async ({ data, type, priority = false }) => {
  for (let id of data) {
    await prisma.seedIdentifier.upsert({
      where: { identifier: id },
      create: {
        identifier: id,
        type,
        timestamp: new Date().toISOString(),
        priority: priority,
        retrieved: false,
      },
      update: {
        priority,
      },
    });
  }
};

const handleSeedIdentifiers = async ({ ids, constantsData }) => {
  for (let id of ids) {
    await markSeedIdentifierRetrieved({ id: id.id });
    if (
      id.type === "idSummoner" ||
      id.type === "idPUUID" ||
      id.type === "idSummonerName"
    ) {
      await getSummonerDataFromRiot({ id, constantsData });
    } else if (id.type === "idMatch") {
      await getMatchDataFromRiot({ id, constantsData });
    }
  }
};

const markSeedIdentifierRetrieved = async ({ id }) => {
  await prisma.seedIdentifier.update({
    where: { id: id },
    data: {
      retrieved: true,
    },
  });
};

async function main() {
  // await prisma.seedIdentifier.deleteMany({});
  // await prisma.player.deleteMany({});
  // await prisma.game.deleteMany({});
  // await prisma.runeSelection.deleteMany({});
  // await prisma.runeStyle.deleteMany({});
  // await prisma.team.deleteMany({});
  // await prisma.playerRune.deleteMany();
  // await prisma.playerEndOfGameStat.deleteMany({});
  // await prisma.objective.deleteMany({});
  // await prisma.pickBan.deleteMany({});

  let constantsData = await prisma.constant.findFirst();
  if (!constantsData) {
    constantsData = await prisma.constant.create({
      data: {
        currentSeason: "12",
        startTime: "1640239866000",
        seeding: true,
      },
    });
  }
  if ((await prisma.seedIdentifier.count()) === 0) {
    const challengersResponse = await api.League.getChallengerLeaguesByQueue(
      Constants.Queues.RANKED_SOLO_5x5,
      Constants.Regions.AMERICA_NORTH
    );
    const challengers = challengersResponse.response;
    await getSummonerDataFromRiot({
      id: {
        identifier: challengers.entries[0].summonerId,
        type: "idSummoner",
        priority: false,
      },
      constantsData,
    });
  }
  while (constantsData.seeding) {
    constantsData = await prisma.constant.findFirst();
    const allSeedIdentifiers = await prisma.seedIdentifier.findMany({
      where: {
        retrieved: { equals: false },
      },
      orderBy: [
        {
          priority: "desc",
        },
        {
          timestamp: "asc",
        },
      ],
      take: 20,
    });
    await handleSeedIdentifiers({
      ids: allSeedIdentifiers,
      constantsData: constantsData,
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
