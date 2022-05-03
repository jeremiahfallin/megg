import { pathToRegexp } from "path-to-regexp";
import { HOST, METHODS } from "./@types";
const matchPath = (path, url) => {
    const keys = [];
    const regexp = pathToRegexp(path, keys);
    const match = regexp.exec(url);
    if (!match)
        return false;
    const [uri, ...values] = match;
    const isExact = path === uri;
    return {
        path,
        isExact,
        values,
        url: path === "/" && uri === "" ? "/" : uri,
    };
};
export const extractRegion = (url) => {
    const uri = new URL(url);
    const didMatch = matchPath(HOST, uri.host);
    if (didMatch)
        return didMatch.values[0];
    return null;
};
export const extractMethod = (url) => {
    const path = new URL(url).pathname;
    let method = null;
    Object.keys(METHODS).map((service) => {
        Object.entries(METHODS[service]).some(([m, p]) => {
            if (matchPath(p, path)) {
                method = `${service}.${m}`;
                return true;
            }
        });
    });
    return method;
};
