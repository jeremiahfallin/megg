import { list } from "@keystone-6/core";
import { integer, relationship, text } from "@keystone-6/core/fields";

export const PlayerItemEvent = list({
  fields: {
    player: relationship({ ref: "Player.itemEvent", many: true }),
    type: text(),
    itemId: integer(),
    name: text(),
    undoId: integer(),
  },
});
