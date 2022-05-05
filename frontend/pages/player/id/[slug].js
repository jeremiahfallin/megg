import { useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "urql";
import { Profile } from "../../../components";

const PLAYER_QUERY = gql`
  query PLAYER_QUERY($where: PlayerWhereUniqueInput!) {
    player(where: $where) {
      id
      summonerName
      puuid
      accountId
      profile {
        id
        lastUpdate
        kills
        deaths
        assists
        kda
        winRate
        csPerMinute
        damagePerMinute
        killsPerMinute
        goldPerMinute
        averageGameTime
        averageTimeSpentDead
        totalGameTime
        activity {
          id
          month
          year
          day
          gamesPlayed
        }
        championWinrate {
          id
          champion
          wins
          games
          spell1Casts
          spell2Casts
          spell3Casts
          spell4Casts
        }
        duos {
          id
          name
          wins
          losses
          winrate
        }
      }
    }
  }
`;

const PROFILE_COUNT = gql`
  query PROFILE_COUNT($where: ProfileWhereInput!) {
    profilesCount(where: $where)
  }
`;

const CREATE_PROFILE_MUTATION = gql`
  mutation CREATE_PROFILE_MUTATION($data: ProfileCreateInput!) {
    createProfile(data: $data) {
      id
    }
  }
`;

export default function Identifier() {
  const router = useRouter();
  const [{ data, fetching, error }, refetchPlayer] = useQuery({
    query: PLAYER_QUERY,
    variables: {
      where: {
        id: router.query.slug,
      },
    },
  });

  const [
    { data: profileData, fetching: profileFetching, error: profileError },
    refetchProfile,
  ] = useQuery({
    query: PROFILE_COUNT,
    variables: {
      where: {
        player: { id: { equals: router.query.slug } },
      },
    },
  });

  const [{ loading, error: createProfileError }, createProfile] = useMutation(
    CREATE_PROFILE_MUTATION
  );

  const createProfileHandler = async () => {
    if (profileData?.profilesCount === 0 && !profileFetching && !profileError) {
      await createProfile({
        data: {
          update: false,
          player: { connect: { id: router.query.slug } },
        },
      });
      await refetchProfile({ requestPolicy: "network-only" });
    }
  };
  useEffect(() => {
    createProfileHandler();
  }, [profileData]);

  const player = data?.player;

  return <Profile player={player} />;
}
