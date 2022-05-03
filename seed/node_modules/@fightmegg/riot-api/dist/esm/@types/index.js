export var RiotAPITypes;
(function (RiotAPITypes) {
    let QUEUE;
    (function (QUEUE) {
        QUEUE["RANKED_SOLO_5x5"] = "RANKED_SOLO_5x5";
        QUEUE["RANKED_TFT"] = "RANKED_TFT";
        QUEUE["RANKED_FLEX_SR"] = "RANKED_FLEX_SR";
        QUEUE["RANKED_FLEX_TT"] = "RANKED_FLEX_TT";
    })(QUEUE = RiotAPITypes.QUEUE || (RiotAPITypes.QUEUE = {}));
    let TIER;
    (function (TIER) {
        TIER["CHALLENGER"] = "CHALLENGER";
        TIER["GRANDMASTER"] = "GRANDMASTER";
        TIER["MASTER"] = "MASTER";
        TIER["DIAMOND"] = "DIAMOND";
        TIER["PLATINUM"] = "PLATINUM";
        TIER["GOLD"] = "GOLD";
        TIER["SILVER"] = "SILVER";
        TIER["BRONZE"] = "BRONZE";
        TIER["IRON"] = "IRON";
    })(TIER = RiotAPITypes.TIER || (RiotAPITypes.TIER = {}));
    let TFT_TIER;
    (function (TFT_TIER) {
        TFT_TIER["DIAMOND"] = "DIAMOND";
        TFT_TIER["PLATINUM"] = "PLATINUM";
        TFT_TIER["GOLD"] = "GOLD";
        TFT_TIER["SILVER"] = "SILVER";
        TFT_TIER["BRONZE"] = "BRONZE";
        TFT_TIER["IRON"] = "IRON";
    })(TFT_TIER = RiotAPITypes.TFT_TIER || (RiotAPITypes.TFT_TIER = {}));
    let DIVISION;
    (function (DIVISION) {
        DIVISION["I"] = "I";
        DIVISION["II"] = "II";
        DIVISION["III"] = "III";
        DIVISION["IV"] = "IV";
    })(DIVISION = RiotAPITypes.DIVISION || (RiotAPITypes.DIVISION = {}));
    let VAL_QUEUE;
    (function (VAL_QUEUE) {
        VAL_QUEUE["COMPETITIVE"] = "competitive";
        VAL_QUEUE["UNRATED"] = "unrated";
        VAL_QUEUE["SPIKERUSH"] = "spikerush";
    })(VAL_QUEUE = RiotAPITypes.VAL_QUEUE || (RiotAPITypes.VAL_QUEUE = {}));
    let METHOD_KEY;
    (function (METHOD_KEY) {
        let ACCOUNT;
        (function (ACCOUNT) {
            ACCOUNT.GET_BY_PUUID = "ACCOUNT.GET_BY_PUUID";
            ACCOUNT.GET_BY_RIOT_ID = "ACCOUNT.GET_BY_RIOT_ID";
            ACCOUNT.GET_ACTIVE_SHARD_FOR_PLAYER = "ACCOUNT.GET_ACTIVE_SHARD_FOR_PLAYER";
        })(ACCOUNT = METHOD_KEY.ACCOUNT || (METHOD_KEY.ACCOUNT = {}));
        let CHAMPION_MASTERY;
        (function (CHAMPION_MASTERY) {
            CHAMPION_MASTERY.GET_ALL_CHAMPIONS = "CHAMPION_MASTERY.GET_ALL_CHAMPIONS";
            CHAMPION_MASTERY.GET_CHAMPION_MASTERY = "CHAMPION_MASTERY.GET_CHAMPION_MASTERY";
            CHAMPION_MASTERY.GET_CHAMPION_MASTERY_SCORE = "CHAMPION_MASTERY.GET_CHAMPION_MASTERY_SCORE";
        })(CHAMPION_MASTERY = METHOD_KEY.CHAMPION_MASTERY || (METHOD_KEY.CHAMPION_MASTERY = {}));
        let CHAMPION;
        (function (CHAMPION) {
            CHAMPION.GET_CHAMPION_ROTATIONS = "CHAMPION.GET_CHAMPION_ROTATIONS";
        })(CHAMPION = METHOD_KEY.CHAMPION || (METHOD_KEY.CHAMPION = {}));
        let CLASH;
        (function (CLASH) {
            CLASH.GET_PLAYERS_BY_SUMMONER = "CLASH.GET_PLAYERS_BY_SUMMONER";
            CLASH.GET_TEAM = "CLASH.GET_TEAM";
            CLASH.GET_TOURNAMENTS = "CLASH.GET_TOURNAMENTS";
            CLASH.GET_TOURNAMENT = "CLASH.GET_TOURNAMENT";
            CLASH.GET_TOURNAMENT_TEAM = "CLASH.GET_TOURNAMENT_TEAM";
        })(CLASH = METHOD_KEY.CLASH || (METHOD_KEY.CLASH = {}));
        let LEAGUE_EXP;
        (function (LEAGUE_EXP) {
            LEAGUE_EXP.GET_LEAGUE_ENTRIES = "LEAGUE_EXP.GET_LEAGUE_ENTRIES";
        })(LEAGUE_EXP = METHOD_KEY.LEAGUE_EXP || (METHOD_KEY.LEAGUE_EXP = {}));
        let LEAGUE;
        (function (LEAGUE) {
            LEAGUE.GET_CHALLENGER_BY_QUEUE = "LEAGUE.GET_CHALLENGER_BY_QUEUE";
            LEAGUE.GET_ENTRIES_BY_SUMMONER = "LEAGUE.GET_ENTRIES_BY_SUMMONER";
            LEAGUE.GET_ALL_ENTRIES = "LEAGUE.GET_ALL_ENTRIES";
            LEAGUE.GET_GRANDMASTER_BY_QUEUE = "LEAGUE.GET_GRANDMASTER_BY_QUEUE";
            LEAGUE.GET_LEAGUE_BY_ID = "LEAGUE.GET_LEAGUE_BY_ID";
            LEAGUE.GET_MASTER_BY_QUEUE = "LEAGUE.GET_MASTER_BY_QUEUE";
        })(LEAGUE = METHOD_KEY.LEAGUE || (METHOD_KEY.LEAGUE = {}));
        let LOR_MATCH;
        (function (LOR_MATCH) {
            LOR_MATCH.GET_MATCH_IDS_BY_PUUID = "LOR_RANKED.GET_MATCH_IDS_BY_PUUID";
            LOR_MATCH.GET_MATCH_BY_ID = "LOR_RANKED.GET_MATCH_BY_ID";
        })(LOR_MATCH = METHOD_KEY.LOR_MATCH || (METHOD_KEY.LOR_MATCH = {}));
        let LOR_RANKED;
        (function (LOR_RANKED) {
            LOR_RANKED.GET_MASTER_TIER = "LOR_RANKED.GET_MASTER_TIER";
        })(LOR_RANKED = METHOD_KEY.LOR_RANKED || (METHOD_KEY.LOR_RANKED = {}));
        let MATCH;
        (function (MATCH) {
            MATCH.GET_IDS_BY_TOURNAMENT_CODE = "MATCH.GET_IDS_BY_TOURNAMENT_CODE";
            MATCH.GET_MATCH_BY_ID = "MATCH.GET_MATCH_BY_ID";
            MATCH.GET_MATCH_BY_ID_AND_TOURNAMENT_CODE = "MATCH.GET_MATCH_BY_ID_AND_TOURNAMENT_CODE";
            MATCH.GET_MATCHLIST_BY_ACCOUNT = "MATCH.GET_MATCHLIST_BY_ACCOUNT";
            MATCH.GET_TIMELINE_BY_MATCH_ID = "MATCH.GET_TIMELINE_BY_MATCH_ID";
        })(MATCH = METHOD_KEY.MATCH || (METHOD_KEY.MATCH = {}));
        let MATCH_V5;
        (function (MATCH_V5) {
            MATCH_V5.GET_IDS_BY_PUUID = "MATCH_V5.GET_IDS_BY_PUUID";
            MATCH_V5.GET_MATCH_BY_ID = "MATCH_V5.GET_MATCH_BY_ID";
            MATCH_V5.GET_MATCH_TIMELINE_BY_ID = "MATCH_V5.GET_MATCH_TIMELINE_BY_ID";
        })(MATCH_V5 = METHOD_KEY.MATCH_V5 || (METHOD_KEY.MATCH_V5 = {}));
        let SPECTATOR;
        (function (SPECTATOR) {
            SPECTATOR.GET_GAME_BY_SUMMONER_ID = "SPECTATOR.GET_GAME_BY_SUMMONER_ID";
            SPECTATOR.GET_FEATURED_GAMES = "SPECTATOR.GET_FEATURED_GAMES";
        })(SPECTATOR = METHOD_KEY.SPECTATOR || (METHOD_KEY.SPECTATOR = {}));
        let SUMMONER;
        (function (SUMMONER) {
            SUMMONER.GET_BY_ACCOUNT_ID = "SUMMONER.GET_BY_ACCOUNT_ID";
            SUMMONER.GET_BY_SUMMONER_NAME = "SUMMONER.GET_BY_SUMMONER_NAME";
            SUMMONER.GET_BY_PUUID = "SUMMONER.GET_BY_PUUID";
            SUMMONER.GET_BY_SUMMONER_ID = "SUMMONER.GET_BY_SUMMONER_ID";
            SUMMONER.GET_BY_ACCESS_TOKEN = "SUMMONER.GET_BY_ACCESS_TOKEN";
        })(SUMMONER = METHOD_KEY.SUMMONER || (METHOD_KEY.SUMMONER = {}));
        let TFT_LEAGUE;
        (function (TFT_LEAGUE) {
            TFT_LEAGUE.GET_CHALLENGER = "TFT_LEAGUE.GET_CHALLENGER";
            TFT_LEAGUE.GET_ENTRIES_BY_SUMMONER = "TFT_LEAGUE.GET_ENTRIES_BY_SUMMONER";
            TFT_LEAGUE.GET_ALL_ENTRIES = "TFT_LEAGUE.GET_ALL_ENTRIES";
            TFT_LEAGUE.GET_GRANDMASTER = "TFT_LEAGUE.GET_GRANDMASTER";
            TFT_LEAGUE.GET_LEAGUE_BY_ID = "TFT_LEAGUE.GET_LEAGUE_BY_ID";
            TFT_LEAGUE.GET_MASTER = "TFT_LEAGUE.GET_MASTER";
        })(TFT_LEAGUE = METHOD_KEY.TFT_LEAGUE || (METHOD_KEY.TFT_LEAGUE = {}));
        let TFT_MATCH;
        (function (TFT_MATCH) {
            TFT_MATCH.GET_MATCH_IDS_BY_PUUID = "TFT_MATCH.GET_MATCH_IDS_BY_PUUID";
            TFT_MATCH.GET_MATCH_BY_ID = "TFT_MATCH.GET_MATCH_BY_ID";
        })(TFT_MATCH = METHOD_KEY.TFT_MATCH || (METHOD_KEY.TFT_MATCH = {}));
        let TFT_SUMMONER;
        (function (TFT_SUMMONER) {
            TFT_SUMMONER.GET_BY_ACCOUNT_ID = "TFT_SUMMONER.GET_BY_ACCOUNT_ID";
            TFT_SUMMONER.GET_BY_SUMMONER_NAME = "TFT_SUMMONER.GET_BY_SUMMONER_NAME";
            TFT_SUMMONER.GET_BY_PUUID = "TFT_SUMMONER.GET_BY_PUUID";
            TFT_SUMMONER.GET_BY_SUMMONER_ID = "TFT_SUMMONER.GET_BY_SUMMONER_ID";
        })(TFT_SUMMONER = METHOD_KEY.TFT_SUMMONER || (METHOD_KEY.TFT_SUMMONER = {}));
        let THIRD_PARTY_CODE;
        (function (THIRD_PARTY_CODE) {
            THIRD_PARTY_CODE.GET_BY_SUMMONER_ID = "THIRD_PARTY_CODE.GET_BY_SUMMONER_ID";
        })(THIRD_PARTY_CODE = METHOD_KEY.THIRD_PARTY_CODE || (METHOD_KEY.THIRD_PARTY_CODE = {}));
        let TOURNAMENT_STUB;
        (function (TOURNAMENT_STUB) {
            TOURNAMENT_STUB.POST_CREATE_CODES = "TOURNAMENT_STUB.POST_CREATE_CODES";
            TOURNAMENT_STUB.GET_LOBBY_EVENTS_BY_TOURNAMENT_CODE = "TOURNAMENT_STUB.GET_LOBBY_EVENTS_BY_TOURNAMENT_CODE";
            TOURNAMENT_STUB.POST_CREATE_PROVIDER = "TOURNAMENT_STUB.POST_CREATE_PROVIDER";
            TOURNAMENT_STUB.POST_CREATE_TOURNAMENT = "TOURNAMENT_STUB.POST_CREATE_TOURNAMENT";
        })(TOURNAMENT_STUB = METHOD_KEY.TOURNAMENT_STUB || (METHOD_KEY.TOURNAMENT_STUB = {}));
        let TOURNAMENT;
        (function (TOURNAMENT) {
            TOURNAMENT.POST_CREATE_CODES = "TOURNAMENT.POST_CREATE_CODES";
            TOURNAMENT.GET_TOURNAMENT_BY_CODE = "TOURNAMENT.GET_TOURNAMENT_BY_CODE";
            TOURNAMENT.PUT_TOURNAMENT_CODE = "TOURNAMENT.PUT_TOURNAMENT_CODE";
            TOURNAMENT.GET_LOBBY_EVENTS_BY_TOURNAMENT_CODE = "TOURNAMENT.GET_LOBBY_EVENTS_BY_TOURNAMENT_CODE";
            TOURNAMENT.POST_CREATE_PROVIDER = "TOURNAMENT.POST_CREATE_PROVIDER";
            TOURNAMENT.POST_CREATE_TOURNAMENT = "TOURNAMENT.POST_CREATE_TOURNAMENT";
        })(TOURNAMENT = METHOD_KEY.TOURNAMENT || (METHOD_KEY.TOURNAMENT = {}));
        let VAL_CONTENT;
        (function (VAL_CONTENT) {
            VAL_CONTENT.GET_CONTENT = "VAL_CONTENT.GET_CONTENT";
        })(VAL_CONTENT = METHOD_KEY.VAL_CONTENT || (METHOD_KEY.VAL_CONTENT = {}));
        let VAL_MATCH;
        (function (VAL_MATCH) {
            VAL_MATCH.GET_MATCH_BY_ID = "VAL_MATCH.GET_MATCH_BY_ID";
            VAL_MATCH.GET_MATCHLIST_BY_PUUID = "VAL_MATCH.GET_MATCHLIST_BY_PUUID";
            VAL_MATCH.GET_RECENT_MATCHES_BY_QUEUE = "VAL_MATCH.GET_RECENT_MATCHES_BY_QUEUE";
        })(VAL_MATCH = METHOD_KEY.VAL_MATCH || (METHOD_KEY.VAL_MATCH = {}));
    })(METHOD_KEY = RiotAPITypes.METHOD_KEY || (RiotAPITypes.METHOD_KEY = {}));
    let MatchV5;
    (function (MatchV5) {
        let MatchType;
        (function (MatchType) {
            MatchType["Ranked"] = "ranked";
            MatchType["Normal"] = "normal";
            MatchType["Tourney"] = "tourney";
            MatchType["Tutorial"] = "tutorial";
        })(MatchType = MatchV5.MatchType || (MatchV5.MatchType = {}));
    })(MatchV5 = RiotAPITypes.MatchV5 || (RiotAPITypes.MatchV5 = {}));
    let Tournament;
    (function (Tournament) {
        let REGION;
        (function (REGION) {
            REGION["BR"] = "BR";
            REGION["EUNE"] = "EUNE";
            REGION["EUW"] = "EUW";
            REGION["JP"] = "JP";
            REGION["LAN"] = "LAN";
            REGION["LAS"] = "LAS";
            REGION["NA"] = "NA";
            REGION["OCE"] = "OCE";
            REGION["PBE"] = "PBE";
            REGION["RU"] = "RU";
            REGION["TR"] = "TR";
        })(REGION = Tournament.REGION || (Tournament.REGION = {}));
        let PICKTYPE;
        (function (PICKTYPE) {
            PICKTYPE["BLIND_PICK"] = "BLIND_PICK";
            PICKTYPE["DRAFT_MODE"] = "DRAFT_MODE";
            PICKTYPE["ALL_RANDOM"] = "ALL_RANDOM";
            PICKTYPE["TOURNAMENT_DRAFT"] = "TOURNAMENT_DRAFT";
        })(PICKTYPE = Tournament.PICKTYPE || (Tournament.PICKTYPE = {}));
        let MAPTYPE;
        (function (MAPTYPE) {
            MAPTYPE["SUMMONERS_RIFT"] = "SUMMONERS_RIFT";
            MAPTYPE["TWISTED_TREELINE"] = "TWISTED_TREELINE";
            MAPTYPE["HOWLING_ABYSS"] = "HOWLING_ABYSS";
        })(MAPTYPE = Tournament.MAPTYPE || (Tournament.MAPTYPE = {}));
        let SPECTATORTYPE;
        (function (SPECTATORTYPE) {
            SPECTATORTYPE["NONE"] = "NONE";
            SPECTATORTYPE["LOBBYONLY"] = "LOBBYONLY";
            SPECTATORTYPE["ALL"] = "ALL";
        })(SPECTATORTYPE = Tournament.SPECTATORTYPE || (Tournament.SPECTATORTYPE = {}));
    })(Tournament = RiotAPITypes.Tournament || (RiotAPITypes.Tournament = {}));
    let DDragon;
    (function (DDragon) {
        let REALM;
        (function (REALM) {
            REALM["NA"] = "na";
            REALM["EUW"] = "euw";
            REALM["EUNE"] = "EUNE";
            REALM["BR"] = "br";
            REALM["JP"] = "jp";
            REALM["KR"] = "kr";
            REALM["OCE"] = "oce";
            REALM["LAN"] = "lan";
            REALM["LAS"] = "las";
            REALM["RU"] = "ru";
            REALM["TR"] = "tr";
        })(REALM = DDragon.REALM || (DDragon.REALM = {}));
        let LOCALE;
        (function (LOCALE) {
            LOCALE["cs_CZ"] = "cs_CZ";
            LOCALE["el_GR"] = "el_GR";
            LOCALE["pl_PL"] = "pl_PL";
            LOCALE["ro_RO"] = "ro_RO";
            LOCALE["hu_HU"] = "hu_HU";
            LOCALE["en_GB"] = "en_GB";
            LOCALE["de_DE"] = "de_DE";
            LOCALE["es_ES"] = "es_ES";
            LOCALE["it_IT"] = "it_IT";
            LOCALE["fr_FR"] = "fr_FR";
            LOCALE["ja_JP"] = "ja_JP";
            LOCALE["ko_KR"] = "ko_KR";
            LOCALE["es_MX"] = "es_MX";
            LOCALE["es_AR"] = "es_AR";
            LOCALE["pt_BR"] = "pt_BR";
            LOCALE["en_US"] = "en_US";
            LOCALE["en_AU"] = "en_AU";
            LOCALE["ru_RU"] = "ru_RU";
            LOCALE["tr_TR"] = "tr_TR";
            LOCALE["ms_MY"] = "ms_MY";
            LOCALE["en_PH"] = "en_PH";
            LOCALE["en_SG"] = "en_SG";
            LOCALE["th_TH"] = "th_TH";
            LOCALE["vn_VN"] = "vn_VN";
            LOCALE["id_ID"] = "id_ID";
            LOCALE["zh_MY"] = "zh_MY";
            LOCALE["zh_CN"] = "zh_CN";
            LOCALE["zh_TW"] = "zh_TW";
        })(LOCALE = DDragon.LOCALE || (DDragon.LOCALE = {}));
    })(DDragon = RiotAPITypes.DDragon || (RiotAPITypes.DDragon = {}));
})(RiotAPITypes || (RiotAPITypes = {}));
