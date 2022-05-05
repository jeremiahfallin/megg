import { Button, Flex, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { gql, useMutation } from "urql";
import { Activity, ChampionStats, Duos, PlayerStats } from "./";

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile(
    $where: ProfileWhereUniqueInput!
    $data: ProfileUpdateInput!
  ) {
    updateProfile(where: $where, data: $data) {
      id
    }
  }
`;

export default function Profile({ player }) {
  const [{ data, fetching, error }, updateProfile] = useMutation(
    UPDATE_PROFILE_MUTATION
  );

  if (!player || !player?.profile) {
    return null;
  }
  const profile = player.profile;

  const handleUpdateProfile = async () => {
    await updateProfile({
      where: {
        id: profile.id,
      },
      data: {
        update: true,
      },
    });
  };

  return (
    <Grid position="relative">
      <Button
        onClick={() => handleUpdateProfile()}
        position="absolute"
        top="4"
        right="8"
      >
        Refetch
      </Button>
      <Heading>{player.summonerName}</Heading>
      <GridItem>{profile.lastUpdate}</GridItem>

      <PlayerStats
        stats={{
          kills: profile.kills,
          deaths: profile.deaths,
          assists: profile.assists,
          kda: profile.kda,
          winRate: profile.winRate,
          csPerMinute: profile.csPerMinute,
          damagePerMinute: profile.damagePerMinute,
          killsPerMinute: profile.killsPerMinute,
          goldPerMinute: profile.goldPerMinute,
          averageGameTime: profile.averageGameTime,
          averageTimeSpentDead: profile.averageTimeSpentDead,
          totalGameTime: profile.totalGameTime,
        }}
      />
      <Activity activity={profile.activity} />
      <Flex gap={4} w="100%" justify="center" px={4}>
        <ChampionStats championStats={profile.championWinrate} />
        <Duos duos={profile.duos} />
      </Flex>
    </Grid>
  );
}
