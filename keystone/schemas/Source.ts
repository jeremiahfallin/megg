import { list } from "@keystone-6/core";
import { relationship, text } from "@keystone-6/core/fields";

export const Source = list({
  fields: {
    game: relationship({ ref: "Game.source", many: true }),
    api: text(),
  },
});
