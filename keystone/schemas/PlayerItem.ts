import { list } from "@keystone-6/core";
import { integer, relationship, text } from "@keystone-6/core/fields";

export const PlayerItem = list({
  fields: {
    slot: integer(),
    itemId: integer(),
    name: text(),
    playerEndOfGameStat: relationship({
      ref: "PlayerEndOfGameStat.items",
      many: true,
    }),
  },
});
