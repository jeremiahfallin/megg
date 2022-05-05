import {
  Flex,
  Heading,
  Table,
  Tbody,
  Th,
  Thead,
  Td,
  Tr,
} from "@chakra-ui/react";
import Link from "../Link";

export default function Duos({ duos }) {
  return (
    <Flex direction={"column"}>
      <Heading>Duos</Heading>
      <Table variant="striped" background="blackAlpha.300">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Winrate</Th>
            <Th>Wins</Th>
            <Th>Losses</Th>
          </Tr>
        </Thead>
        <Tbody>
          {duos
            .filter((duo) => duo.name)
            .map((duo) => {
              return (
                <Tr key={duo.id}>
                  <Td>
                    <Link
                      href={`/player/id/${duo.id}`}
                      fontColor="whiteAlpha.800"
                    >
                      {duo.name}
                    </Link>
                  </Td>
                  <Td>{duo.winrate}</Td>
                  <Td>{duo.wins}</Td>
                  <Td>{duo.losses}</Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </Flex>
  );
}
