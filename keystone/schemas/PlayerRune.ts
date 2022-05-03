import { list } from "@keystone-6/core";
import { text, integer, relationship, checkbox } from "@keystone-6/core/fields";

export const PlayerRune = list({
  fields: {
    playerEndOfGameStat: relationship({
      ref: "PlayerEndOfGameStat.perks",
    }),
    runeStyle: relationship({ ref: "RuneStyle.playerRunes", many: true }),
    defense: integer(),
    flex: integer(),
    offense: integer(),
  },
});

export const RuneStyle = list({
  fields: {
    playerRunes: relationship({ ref: "PlayerRune.runeStyle" }),
    selection: relationship({ ref: "RuneSelection.runeStyle", many: true }),
    description: text(),
    style: integer(),
  },
});

export const RuneSelection = list({
  fields: {
    runeStyle: relationship({ ref: "RuneStyle.selection" }),
    perk: integer(),
    var1: integer(),
    var2: integer(),
    var3: integer(),
  },
});
