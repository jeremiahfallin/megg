import { list } from "@keystone-6/core";
import { integer, relationship, select, text } from "@keystone-6/core/fields";

export const PlayerSkillLevelUpEvent = list({
  fields: {
    player: relationship({ ref: "Player.skillLevelUpEvents", many: true }),
    type: text(),
    slot: integer(),
  },
});
