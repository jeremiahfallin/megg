import { list } from "@keystone-6/core";
import { checkbox, text } from "@keystone-6/core/fields";

export const Constant = list({
  fields: {
    startTime: text(),
    currentSeason: text(),
    seeding: checkbox({
      defaultValue: false,
    }),
  },
});
