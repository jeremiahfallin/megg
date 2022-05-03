import { list } from "@keystone-6/core";
import { integer, relationship, text } from "@keystone-6/core/fields";

export const Game = list({
  fields: {
    matchId: text({ isIndexed: "unique", isFilterable: true }),
    gameId: text({ isFilterable: true }),
    gameCreation: text(),
    gameStartTimestamp: text(),
    gameEndTimestamp: text(),
    duration: integer(),
    start: text(),
    gameVersion: text(),
    blueTeam: relationship({ ref: "Team", many: false }),
    redTeam: relationship({ ref: "Team", many: false }),
    source: relationship({ ref: "Source.game", many: true }),
    tournament: text(),
    gameInSeries: integer(),
    vod: text(),
    platformId: text(),
  },
});
