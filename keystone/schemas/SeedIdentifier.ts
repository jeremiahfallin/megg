import { list } from "@keystone-6/core";
import { checkbox, text, timestamp } from "@keystone-6/core/fields";

export const SeedIdentifier = list({
  fields: {
    identifier: text({ isIndexed: "unique", isFilterable: true }),
    type: text(),
    timestamp: timestamp({
      defaultValue: { kind: "now" },
      validation: {
        isRequired: true,
      },
    }),
    priority: checkbox({ defaultValue: false }),
    retrieved: checkbox({ defaultValue: false }),
  },
});
