import "dotenv/config";
import { createClient, defaultExchanges } from "@urql/core";
import {
  RiotAPI,
  RiotAPITypes,
  PlatformId,
  DDragon,
} from "@fightmegg/riot-api";
import "isomorphic-unfetch";

import {
  CONSTANTS_QUERY,
  CREATE_CONSTANTS_MUTATION,
  CREATE_GAME_MUTATION,
  CREATE_PLAYER_END_OF_GAME_STATS_MUTATION,
  CREATE_SEED_IDENTIFIERS_MUTATION,
  CREATE_SUMMONER_MUTATION,
  GAME_QUERY,
  SEED_IDENTIFIER_COUNT_QUERY,
  SEED_IDENTIFIER_QUERY,
  SUMMONER_COUNT,
  SUMMONER_QUERY,
  UPDATE_SEED_IDENTIFIER_MUTATION,
  UPDATE_SUMMONER_MUTATION,
} from "./operations";

const client = createClient({
  url: "http://localhost:8000/api/graphql",
  exchanges: defaultExchanges,
});

const riotKey = process.env.RIOT_KEY || "";
const api = new RiotAPI(riotKey);

function currentTime() {
  return new Date().toISOString();
}

const getSummonerDataFromRiot = async ({ id, constantsData }) => {
  if (id.type === "idSummoner") {
    const summoner = await api.summoner
      .getBySummonerId({
        region: PlatformId.NA1,
        summonerId: id.identifier,
      })
      .catch((err) => {
        console.dir(id);
        console.error(err);
        return;
      });
    handleRetrievedSummoner({ id, summoner, constantsData });
  } else if (id.type === "idPUUID") {
    const summoner = await api.summoner
      .getByPUUID({
        region: PlatformId.NA1,
        puuid: id.identifier,
      })
      .catch((err) => {
        console.dir(id);
        console.error(err);
        return;
      });
    handleRetrievedSummoner({ id, summoner, constantsData });
  } else if (id.type === "idSummonerName") {
    const summoner = await api.summoner
      .getBySummonerName({
        region: PlatformId.NA1,
        summonerName: id.identifier,
      })
      .catch((err) => {
        console.dir(id);
        console.error(err);
        return;
      });
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

    if (
      (
        await client
          .query(SUMMONER_QUERY, { where: { summonerId: summoner.id } })
          .toPromise()
      ).data.player === null
    ) {
      await client
        .mutation(CREATE_SUMMONER_MUTATION, {
          data: data,
        })
        .toPromise();
    } else {
      await client
        .mutation(UPDATE_SUMMONER_MUTATION, {
          where: { summonerId: summoner?.id },
          data: data,
        })
        .toPromise();
    }

    let matchIds = [];
    while (summoner.puuid !== null && summoner.puuid !== undefined) {
      const newMatchIds = await api.matchV5
        .getIdsbyPuuid({
          cluster: PlatformId.AMERICAS,
          puuid: summoner.puuid,
          params: {
            queue: 420,
            count: 100,
            start: matchIds.length,
            startTime: constantsData.startTime.slice(0, -4),
          },
        })
        .catch((err) => {
          console.error(err);
        });
      console.log(`${summoner?.puuid} new matches: ${newMatchIds?.length}`);
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
  let match = await api.matchV5
    .getMatchById({
      cluster: PlatformId.AMERICAS,
      matchId: id.identifier,
    })
    .catch((err) => {
      console.error(err);
    });
  try {
    if (match?.info.gameVersion.startsWith(constantsData.currentSeason)) {
      await createSeedIdentifiers({
        data: match.metadata.participants,
        type: "idPUUID",
      });
      for (let participant of match.info.participants) {
        const playerCount = await client
          .query(SUMMONER_COUNT, {
            where: {
              puuid: { equals: participant.puuid },
            },
          })
          .toPromise();
        if (playerCount.data.playersCount === 0) {
          await getSummonerDataFromRiot({
            id: {
              type: "idPUUID",
              identifier: participant.puuid,
              priority: false,
            },
            constantsData: constantsData,
          });
        }
      }
      const isGameInDatabase = await client
        .query(GAME_QUERY, { where: { matchId: match.metadata.matchId } })
        .toPromise();

      if (isGameInDatabase.data.game !== null) {
        return;
      }

      await client
        .mutation(CREATE_GAME_MUTATION, {
          data: {
            duration: match.info.gameDuration,
            start: match.info.gameCreation.toString(),
            gameVersion: match.info.gameVersion.toString(),
            tournament: match.info.tournamentCode,
            matchId: match.metadata.matchId.toString(),
            gameId: match.info.gameId.toString(),
            gameCreation: match.info.gameCreation.toString(),
            gameStartTimestamp: match.info.gameStartTimestamp.toString(),
            gameEndTimestamp: match.info.gameEndTimestamp.toString(),
            platformId: match.info.platformId.toString(),
            blueTeam: {
              create: {
                teamId: match.info.teams.filter((p) => p.teamId === 100)[0]
                  .teamId,
                win: match.info.teams.filter((p) => p.teamId === 100)[0].win,
                teamMatchId: `${match.metadata.matchId}_blue`,
                players: {
                  connect: match.info.participants
                    .filter((p) => p.teamId === 100)
                    .map((p) => ({
                      puuid: p.puuid,
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
                    match.info.teams.filter((p) => p.teamId === 100)[0]
                      .objectives
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
                  connect: match.info.participants
                    .filter((p) => p.teamId === 200)
                    .map((p) => ({
                      puuid: p.puuid,
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
                    match.info.teams.filter((p) => p.teamId === 200)[0]
                      .objectives
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
        })
        .toPromise();

      await client
        .mutation(CREATE_PLAYER_END_OF_GAME_STATS_MUTATION, {
          data: match.info.participants.map((participant) => {
            return {
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
            };
          }),
        })
        .toPromise();
    } else if (match.info.gameCreation > constantsData.startTime) {
      let newConstantsData = await client
        .mutation(UPDATE_CONSTANTS_MUTATION, {
          where: { id: constantsData.id },
          data: {
            startTime: match.info.gameCreation.toString(),
          },
        })
        .toPromise();
      constantsData = newConstantsData.data;
    }
  } catch (error) {
    console.dir(id);
    console.error(error);
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

const createSeedIdentifiers = async ({ data, type, priority = false }) => {
  for (let id of data) {
    let si = await client
      .query(SEED_IDENTIFIER_QUERY, {
        where: {
          identifier: { equals: id },
          retrieved: { equals: false },
        },
      })
      .toPromise();
    if (si.data.seedIdentifiers.length > 0) {
      await client
        .mutation(UPDATE_SEED_IDENTIFIER_MUTATION, {
          where: { id: si.data.seedIdentifiers[0].id },
          data: {
            priority: priority,
          },
        })
        .toPromise();
    }
  }

  await client
    .mutation(CREATE_SEED_IDENTIFIERS_MUTATION, {
      data: data.map((id) => ({
        identifier: id,
        type: type,
        priority: priority,
        timestamp: currentTime(),
        retrieved: false,
      })),
    })
    .toPromise();
};

const markSeedIdentifierRetrieved = async ({ id }) => {
  await client
    .mutation(UPDATE_SEED_IDENTIFIER_MUTATION, {
      where: { id },
      data: {
        retrieved: true,
      },
    })
    .toPromise();
};

const main = async () => {
  let { data: constantsData } = await client.query(CONSTANTS_QUERY).toPromise();
  if (constantsData.constants.length === 0) {
    constantsData = await client
      .mutation(CREATE_CONSTANTS_MUTATION, {
        data: {
          currentSeason: "12",
          startTime: "1640239866000",
        },
      })
      .toPromise();
    constantsData = {
      constants: [
        {
          id: constantsData.data.createConstant.id,
          currentSeason: constantsData.data.createConstant.currentSeason,
          startTime: constantsData.data.createConstant.startTime,
        },
      ],
    };
  }
  if (
    (await client.query(SEED_IDENTIFIER_COUNT_QUERY).toPromise()).data
      .seedIdentifiersCount === 0
  ) {
    const challengers = await api.league.getChallengerByQueue({
      region: PlatformId.NA1,
      queue: "RANKED_SOLO_5x5",
    });
    await createSeedIdentifiers({
      data: challengers.entries.map((entry) => entry.summonerId),
      type: "idSummoner",
    });
  }

  while (true) {
    const {
      data: { seedIdentifiers },
    } = await client
      .query(SEED_IDENTIFIER_QUERY, {
        where: {
          retrieved: { equals: false },
        },
        orderBy: [{ priority: "desc" }, { timestamp: "asc" }],
        take: 20,
      })
      .toPromise();
    await handleSeedIdentifiers({
      ids: seedIdentifiers,
      constantsData: constantsData.constants[0],
    });
  }
};

main();
