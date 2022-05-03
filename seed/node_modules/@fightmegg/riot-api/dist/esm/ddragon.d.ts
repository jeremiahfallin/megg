import { RiotAPITypes } from "./index";
export declare class DDragon {
    readonly locale: RiotAPITypes.DDragon.LOCALE;
    readonly defaultRealm: RiotAPITypes.DDragon.REALM;
    readonly host: string;
    request<T>(path: string): Promise<T>;
    get versions(): {
        latest: () => Promise<string>;
        all: () => Promise<string[]>;
    };
    get champion(): {
        all: ({ locale, version, }?: {
            locale?: RiotAPITypes.DDragon.LOCALE | undefined;
            version?: string | undefined;
        }) => Promise<RiotAPITypes.DDragon.DDragonChampionListDTO>;
        byName: ({ locale, version, championName, }: {
            locale?: RiotAPITypes.DDragon.LOCALE | undefined;
            version?: string | undefined;
            championName: string;
        }) => Promise<RiotAPITypes.DDragon.DDragonChampionDTO>;
    };
    realm({ realm, }?: {
        realm?: RiotAPITypes.DDragon.REALM;
    }): Promise<RiotAPITypes.DDragon.DDragonRealmsDTO>;
    items({ locale, version, }?: {
        locale?: RiotAPITypes.DDragon.LOCALE;
        version?: string;
    }): Promise<RiotAPITypes.DDragon.DDragonItemWrapperDTO>;
    runesReforged({ locale, version, }?: {
        locale?: RiotAPITypes.DDragon.LOCALE;
        version?: string;
    }): Promise<RiotAPITypes.DDragon.DDragonRunesReforgedDTO[]>;
    summonerSpells({ locale, version, }?: {
        locale?: RiotAPITypes.DDragon.LOCALE;
        version?: string;
    }): Promise<RiotAPITypes.DDragon.DDragonSummonerSpellDTO>;
    profileIcons({ locale, version, }?: {
        locale?: RiotAPITypes.DDragon.LOCALE;
        version?: string;
    }): Promise<RiotAPITypes.DDragon.DDragonProfileIconDTO>;
    maps({ locale, version, }?: {
        locale?: RiotAPITypes.DDragon.LOCALE;
        version?: string;
    }): Promise<RiotAPITypes.DDragon.DDragonMapDTO>;
}
