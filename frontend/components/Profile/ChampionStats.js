import {
  Flex,
  Table,
  Tbody,
  Th,
  Thead,
  Td,
  Tr,
  Heading,
} from "@chakra-ui/react";

export default function ChampionStats({ championStats }) {
  return (
    <Flex direction={"column"}>
      <Heading>Champion Stats</Heading>
      <Table variant="striped" background="blackAlpha.300">
        <Thead>
          <Tr>
            <Th>Champ</Th>
            <Th>Wins</Th>
            <Th>Games</Th>
            <Th>Q Casts</Th>
            <Th>W Casts</Th>
            <Th>E Casts</Th>
            <Th>R Casts</Th>
          </Tr>
        </Thead>
        <Tbody>
          {championStats?.map((champion) => {
            return (
              <Tr key={champion.id}>
                <Td>{champion.champion}</Td>
                <Td>{champion.wins}</Td>
                <Td>{champion.games}</Td>
                <Td>{champion.spell1Casts}</Td>
                <Td>{champion.spell2Casts}</Td>
                <Td>{champion.spell3Casts}</Td>
                <Td>{champion.spell4Casts}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Flex>
  );
}
