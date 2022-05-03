import { list } from "@keystone-6/core";
import { relationship, text } from "@keystone-6/core/fields";

export const TeamMonsterKill = list({
  fields: {
    killer: relationship({ ref: "Player.monsterKills", many: true }),
    type: text(),
    subType: text(),
  },
});
