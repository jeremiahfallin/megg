import { list } from "@keystone-6/core";
import { relationship } from "@keystone-6/core/fields";

export const PlayerKill = list({
  fields: {
    killer: relationship({ ref: "Player.kills", many: true }),
    victim: relationship({ ref: "Player.deaths", many: true }),
  },
});
