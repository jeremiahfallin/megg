import fetch from "node-fetch";
import { RiotAPITypes } from "./index";
export class DDragon {
    constructor() {
        this.locale = RiotAPITypes.DDragon.LOCALE.en_GB;
        this.defaultRealm = RiotAPITypes.DDragon.REALM.EUW;
        this.host = "https://ddragon.leagueoflegends.com";
    }
    async request(path) {
        const resp = await fetch(`${this.host}${path}`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        if (resp.ok)
            return resp.json();
        throw resp;
    }
    get versions() {
        return {
            latest: async () => {
                const ddVersions = await this.request("/api/versions.json");
                return ddVersions[0];
            },
            all: () => this.request("/api/versions.json"),
        };
    }
    get champion() {
        return {
            all: async ({ locale = this.locale, version, } = {}) => {
                const v = version || (await this.versions.latest());
                return await this.request(`/cdn/${v}/data/${locale}/champion.json`);
            },
            byName: async ({ locale = this.locale, version, championName, }) => {
                if (!championName)
                    throw new Error("championName is required");
                const v = version || (await this.versions.latest());
                return await this.request(`/cdn/${v}/data/${locale}/champion/${championName}.json`);
            },
        };
    }
    async realm({ realm = this.defaultRealm, } = {}) {
        return await this.request(`/realms/${realm}.json`);
    }
    async items({ locale = this.locale, version, } = {}) {
        const v = version || (await this.versions.latest());
        return await this.request(`/cdn/${v}/data/${locale}/item.json`);
    }
    async runesReforged({ locale = this.locale, version, } = {}) {
        const v = version || (await this.versions.latest());
        return await this.request(`/cdn/${v}/data/${locale}/runesReforged.json`);
    }
    async summonerSpells({ locale = this.locale, version, } = {}) {
        const v = version || (await this.versions.latest());
        return await this.request(`/cdn/${v}/data/${locale}/summoner.json`);
    }
    async profileIcons({ locale = this.locale, version, } = {}) {
        const v = version || (await this.versions.latest());
        return await this.request(`/cdn/${v}/data/${locale}/profileicon.json`);
    }
    async maps({ locale = this.locale, version, } = {}) {
        const v = version || (await this.versions.latest());
        return await this.request(`/cdn/${v}/data/${locale}/map.json`);
    }
}
