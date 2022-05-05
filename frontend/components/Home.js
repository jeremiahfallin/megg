import { Box } from "@chakra-ui/react";
import { gql, useQuery } from "urql";

import Link from "./Link";

const PLAYERS_QUERY = gql`
  query Players($where: PlayerWhereInput!, $take: Int) {
    players(where: $where, take: $take) {
      id
      summonerName
      puuid
      accountId
    }
  }
`;

export default function Home({ children }) {
  const [{ data, fetching, error }] = useQuery({
    query: PLAYERS_QUERY,
    variables: {
      where: {
        summonerName: {
          not: {
            equals: "",
          },
        },
      },
      take: 20,
    },
  });
  if (fetching) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const players = data?.players;
  return (
    <Box>
      {players?.map((player) => {
        return (
          <Box key={player.id}>
            <Link href={`/player/id/${player.id}`} fontColor="whiteAlpha.900">
              {player.summonerName}
            </Link>
          </Box>
        );
      })}
    </Box>
  );
}
