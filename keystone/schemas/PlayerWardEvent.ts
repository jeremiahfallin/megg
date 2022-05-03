import { list } from "@keystone-6/core";
import { relationship, select, text } from "@keystone-6/core/fields";

export const PlayerWardEvent = list({
  fields: {
    player: relationship({ ref: "Player.wardEvents", many: true }),
    type: text(),
    wardType: select({
      type: "enum",
      options: [
        { value: "YELLOW_TRINKET", label: "YELLOW_TRINKET" },
        { value: "CONTROL_WARD", label: "CONTROL_WARD" },
        { value: "SIGHT_WARD", label: "SIGHT_WARD" },
        { value: "YELLOW_TRINKET_UPGRADE", label: "YELLOW_TRINKET_UPGRADE" },
        { value: "BLUE_TRINKET", label: "BLUE_TRINKET" },
        { value: "TEEMO_MUSHROOM", label: "TEEMO_MUSHROOM" },
        { value: "VISION_WARD", label: "VISION_WARD" },
        { value: "UNDEFINED", label: "UNDEFINED" },
      ],
      ui: {
        displayMode: "select",
      },
    }),
  },
});
