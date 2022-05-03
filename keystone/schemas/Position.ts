import { list } from "@keystone-6/core";
import { relationship, integer } from "@keystone-6/core/fields";

export const Position = list({
  fields: {
    event: relationship({ ref: "Event.position", many: true }),
    x: integer(),
    y: integer(),
    playerSnapshot: relationship({
      ref: "PlayerSnapshot.position",
      many: true,
    }),
  },
});
