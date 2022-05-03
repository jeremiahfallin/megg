import { list } from "@keystone-6/core";
import { integer, relationship, text } from "@keystone-6/core/fields";

export const Timeline = list({
  fields: {
    realTimestamp: text(),
    frameInterval: text(),
  },
});
