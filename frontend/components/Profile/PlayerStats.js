import { Box, Grid, Progress, Tooltip } from "@chakra-ui/react";

export default function PlayerStats({ stats }) {
  return (
    <Grid p={4} templateColumns={"repeat(2, 1fr)"} gap={4}>
      <Grid
        templateColumns={`repeat(4, auto)`}
        templateRows={`repeat(2, 1fr)`}
        columnGap={8}
        rowGap={5}
        background="gray.700"
        borderRadius="lg"
        px={8}
        py={4}
        fontSize="lg"
        fontWeight="bold"
        alignItems="center"
      >
        <Tooltip label="Winrate">
          <Box>
            <Box fontSize={"sm"}>Winrate</Box>
            <Box fontSize={"2xl"}>{stats.winRate}%</Box>
            <Progress value={stats.winRate} background={"red.400"} />
          </Box>
        </Tooltip>
        <Tooltip label="Total playtime">
          <Box>
            <Box fontSize={"sm"}>Playtime</Box>
            <Box fontSize={"2xl"}>{stats.totalGameTime}</Box>
          </Box>
        </Tooltip>
        <Tooltip label="Average game time">
          <Box>
            <Box fontSize={"sm"}>AGT</Box>
            <Box fontSize={"2xl"}>{stats.averageGameTime}</Box>
          </Box>
        </Tooltip>
        <Tooltip label="Average time spent dead per game">
          <Box>
            <Box fontSize={"sm"}>% Dead</Box>
            <Box fontSize={"2xl"}>{100 * stats.averageTimeSpentDead}%</Box>
            <Progress
              value={100 * stats.averageTimeSpentDead}
              colorScheme={"pink"}
              background={"gray.400"}
            />
          </Box>
        </Tooltip>
        <Tooltip label="Total season kills">
          <Box>
            <Box fontSize={"sm"}>kills</Box>
            <Box fontSize={"2xl"}>{stats.kills}</Box>
          </Box>
        </Tooltip>
        <Tooltip label="Total season deaths">
          <Box>
            <Box fontSize={"sm"}>deaths</Box>
            <Box fontSize={"2xl"}>{stats.deaths}</Box>
          </Box>
        </Tooltip>
        <Tooltip label="Total season assists">
          <Box>
            <Box fontSize={"sm"}>assists</Box>
            <Box fontSize={"2xl"}>{stats.assists}</Box>
          </Box>
        </Tooltip>
        <Tooltip label="(Kills + Assists) / Deaths">
          <Box>
            <Box fontSize={"sm"}>kda</Box>
            <Box fontSize={"2xl"}>{stats.kda}</Box>
          </Box>
        </Tooltip>
      </Grid>
      <Grid
        templateColumns={`repeat(4, auto)`}
        templateRows={`repeat(2, 1fr)`}
        columnGap={8}
        rowGap={5}
        background="gray.700"
        borderRadius="lg"
        px={8}
        py={4}
        fontSize="lg"
        fontWeight="bold"
        alignItems="center"
      >
        <Tooltip label="Kills per minute">
          <Box>
            <Box fontSize={"sm"}>KPM</Box>
            <Box fontSize={"2xl"}>{stats.killsPerMinute}</Box>
          </Box>
        </Tooltip>
        <Tooltip label="Average CS per minute">
          <Box>
            <Box fontSize={"sm"}>CS/min</Box>
            <Box fontSize={"2xl"}>{stats.csPerMinute}</Box>
          </Box>
        </Tooltip>
        <Tooltip label="Damage per minute">
          <Box>
            <Box fontSize={"sm"}>DPM</Box>
            <Box fontSize={"2xl"}>{stats.damagePerMinute}</Box>
          </Box>
        </Tooltip>
        <Tooltip label="Gold per minute">
          <Box>
            <Box fontSize={"sm"}>GPM</Box>
            <Box fontSize={"2xl"}>{stats.goldPerMinute}</Box>
          </Box>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
