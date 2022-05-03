import { list } from "@keystone-6/core";
import { relationship, integer, float } from "@keystone-6/core/fields";

export const PlayerSnapshot = list({
  fields: {
    timestamp: float(),
    currentGold: integer(),
    totalGold: integer(),
    totalGoldDiff: integer(),
    xp: integer(),
    xpDiff: integer(),
    level: integer(),
    cs: integer(),
    csDiff: integer(),
    monstersKilled: integer(),
    monstersKilledDiff: integer(),
    position: relationship({ ref: "Position.playerSnapshot", many: true }),
    player: relationship({ ref: "Player.snapshots", many: true }),
  },
});
