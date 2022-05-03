import { list } from "@keystone-6/core";
import { integer, relationship } from "@keystone-6/core/fields";

export const Event = list({
  fields: {
    timestamp: integer(),
    position: relationship({ ref: "Position.event", many: true }),
  },
});
