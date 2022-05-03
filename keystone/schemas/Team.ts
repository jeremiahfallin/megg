import { list } from "@keystone-6/core";
import { checkbox, integer, relationship, text } from "@keystone-6/core/fields";

export const Team = list({
  fields: {
    pickBan: relationship({ ref: "PickBan.team", many: true }),
    game: relationship({ ref: "Game", many: false }),
    players: relationship({ ref: "Player.teams", many: true }),
    objectives: relationship({ ref: "Objective.team", many: true }),
    teamId: integer(),
    teamMatchId: text({ isIndexed: "unique", isFilterable: true }),
    win: checkbox(),
  },
  hooks: {
    afterOperation: async ({ context, operation, inputData, item }) => {
      if (operation === "create") {
        await context.query.Team.updateOne({
          where: {
            id: item.id,
          },
          data: {
            game: {
              connect: {
                matchId: inputData.teamMatchId.split("_", 2).join("_"),
              },
            },
          },
        });
      }
    },
  },
});

export const Objective = list({
  fields: {
    team: relationship({ ref: "Team.objectives" }),
    first: checkbox(),
    kills: integer(),
    type: text(),
  },
});

export const PickBan = list({
  fields: {
    team: relationship({ ref: "Team.pickBan" }),
    championId: integer(),
    pickTurn: integer(),
  },
});
