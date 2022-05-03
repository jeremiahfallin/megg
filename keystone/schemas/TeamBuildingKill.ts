import { list } from "@keystone-6/core";
import { relationship, text } from "@keystone-6/core/fields";

export const TeamBuildingKill = list({
  fields: {
    killer: relationship({ ref: "Player.buildingKills", many: true }),
    type: text(),
    lane: text(),
    side: text(),
    towerLocation: text(),
  },
});
