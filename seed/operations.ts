import { gql } from "@urql/core";

export const TEAM_WITH_NULL_GAME_QUERY = gql`
  query TEAM_WITH_NULL_GAME_QUERY {
    teams(where: { game: null }, take: 200) {
      id
      teamMatchId
    }
    teamsCount(where: { game: null })
  }
`;

export const DELETE_TEAM_MUTATION = gql`
  mutation DELETE_TEAM_MUTATION($where: [TeamWhereUniqueInput!]!) {
    deleteTeams(where: $where) {
      id
    }
  }
`;

export const GAME_TEAM_MATCH_ID_NULL_QUERY = gql`
  query GAME_TEAM_MATCH_ID_NULL_QUERY {
    games(
      where: {
        OR: [
          { blueTeam: { teamMatchId: { equals: "" } } }
          { redTeam: { teamMatchId: { equals: "" } } }
        ]
      }
      take: 200
    ) {
      id
      matchId
      blueTeam {
        id
        teamMatchId
      }
      redTeam {
        id
        teamMatchId
      }
    }
    gamesCount(
      where: {
        OR: [
          { blueTeam: { teamMatchId: { equals: "" } } }
          { redTeam: { teamMatchId: { equals: "" } } }
        ]
      }
    )
  }
`;

export const GAME_QUERY = gql`
  query GAMES_QUERY($where: GameWhereUniqueInput!) {
    game(where: $where) {
      id
      gameId
      blueTeam {
        id
        teamMatchId
      }
      redTeam {
        id
        teamMatchId
      }
    }
  }
`;

export const CONSTANTS_QUERY = gql`
  query CONSTANTS_QUERY {
    constants {
      id
      startTime
      currentSeason
    }
  }
`;

export const CREATE_CONSTANTS_MUTATION = gql`
  mutation CREATE_CONSTANTS_MUTATION($data: ConstantCreateInput!) {
    createConstant(data: $data) {
      id
      startTime
      currentSeason
    }
  }
`;

export const UPDATE_CONSTANTS_MUTATION = gql`
  mutation UPDATE_CONSTANTS_MUTATION(
    $where: ConstantWhereUniqueInput!
    $data: ConstantUpdateInput!
  ) {
    updateConstant(where: $where, data: $data) {
      id
      startTime
      currentSeason
    }
  }
`;

export const CREATE_SEED_IDENTIFIERS_MUTATION = gql`
  mutation CREATE_SEED_IDENTIFIERS_MUTATION(
    $data: [SeedIdentifierCreateInput!]!
  ) {
    createSeedIdentifiers(data: $data) {
      id
    }
  }
`;

export const SEED_IDENTIFIER_COUNT_QUERY = gql`
  query SEED_IDENTIFIER_COUNT_QUERY {
    seedIdentifiersCount
  }
`;

export const SEED_IDENTIFIER_QUERY = gql`
  query SEED_IDENTIFIER_QUERY(
    $where: SeedIdentifierWhereInput!
    $orderBy: [SeedIdentifierOrderByInput!]
    $take: Int
  ) {
    seedIdentifiers(orderBy: $orderBy, take: $take, where: $where) {
      id
      identifier
      type
      timestamp
      priority
      retrieved
    }
  }
`;

export const SUMMONER_COUNT = gql`
  query SUMMONER_COUNT($where: PlayerWhereInput) {
    playersCount(where: $where)
  }
`;

export const SUMMONER_QUERY = gql`
  query SUMMONER_QUERY($where: PlayerWhereUniqueInput!) {
    player(where: $where) {
      id
      puuid
      accountId
      platformId
      summonerId
      summonerLevel
      summonerName
      profileIconId
      revisionDate
    }
  }
`;

export const CREATE_SUMMONER_MUTATION = gql`
  mutation CREATE_SUMMONER_MUTATION($data: PlayerCreateInput!) {
    createPlayer(data: $data) {
      id
      puuid
      revisionDate
      profileIconId
      summonerLevel
      summonerName
      platformId
      accountId
      summonerId
    }
  }
`;

export const UPDATE_SUMMONER_MUTATION = gql`
  mutation UPDATE_SUMMONER_MUTATION(
    $where: PlayerWhereUniqueInput!
    $data: PlayerInput!
  ) {
    updatePlayer(where: $where, data: $data) {
      id
      puuid
      accountId
      platformId
      revisionDate
      profileIconId
      summonerLevel
      summonerName
      summonerId
    }
  }
`;

export const UPDATE_SEED_IDENTIFIER_MUTATION = gql`
  mutation UPDATE_SEED_IDENTIFIER_MUTATION(
    $where: SeedIdentifierWhereUniqueInput!
    $data: SeedIdentifierUpdateInput!
  ) {
    updateSeedIdentifier(where: $where, data: $data) {
      id
      identifier
      type
      timestamp
      priority
      retrieved
    }
  }
`;

export const UPDATE_TEAMS_MUTATION = gql`
  mutation UpdateTeams($data: [TeamUpdateArgs!]!) {
    updateTeams(data: $data) {
      id
    }
  }
`;

export const CREATE_GAME_MUTATION = gql`
  mutation CREATE_GAME_MUTATION($data: GameCreateInput!) {
    createGame(data: $data) {
      id
      vod
      duration
      start
      gameVersion
      tournament
      gameInSeries
      blueTeam {
        id
        game {
          id
        }
      }
      redTeam {
        id
        game {
          id
        }
      }
    }
  }
`;

export const CREATE_PLAYER_END_OF_GAME_STATS_MUTATION = gql`
  mutation CREATE_PLAYER_END_OF_GAME_STATS_MUTATION(
    $data: [PlayerEndOfGameStatCreateInput!]!
  ) {
    createPlayerEndOfGameStats(data: $data) {
      id
    }
  }
`;
