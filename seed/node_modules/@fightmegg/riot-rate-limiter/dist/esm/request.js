import fetch from "node-fetch";
import { extractRateLimits } from "./utils";
export const request = async ({ url, options, }) => {
    const resp = await fetch(url, options);
    const rateLimits = extractRateLimits(resp.headers);
    const { status, statusText } = resp;
    if (resp.status >= 400)
        throw { rateLimits, status, statusText, resp };
    const json = await resp.json();
    return { rateLimits, json };
};
