import { list } from "@keystone-6/core";
import { integer, relationship, text } from "@keystone-6/core/fields";

export const Player = list({
  fields: {
    puuid: text({
      isIndexed: "unique",
      isFilterable: true,
      validation: { isRequired: true },
    }),
    accountId: text(),
    platformId: text(),
    summonerId: text(),
    summonerName: text(),
    summonerLevel: integer(),
    profileIconId: integer(),
    revisionDate: text(),
    kills: relationship({ ref: "PlayerKill.killer", many: true }),
    deaths: relationship({ ref: "PlayerKill.victim", many: true }),

    teams: relationship({ ref: "Team.players", many: true }),
    profile: relationship({ ref: "Profile.player", many: false }),

    monsterKills: relationship({
      ref: "TeamMonsterKill.killer",
      many: true,
    }),
    buildingKills: relationship({
      ref: "TeamBuildingKill.killer",
      many: true,
    }),
    itemEvent: relationship({
      ref: "PlayerItemEvent.player",
      many: true,
    }),
    endOfGameStats: relationship({
      ref: "PlayerEndOfGameStat.player",
      many: true,
    }),
    snapshots: relationship({
      ref: "PlayerSnapshot.player",
      many: true,
    }),
    wardEvents: relationship({
      ref: "PlayerWardEvent.player",
      many: true,
    }),
    skillLevelUpEvents: relationship({
      ref: "PlayerSkillLevelUpEvent.player",
      many: true,
    }),
  },
});
