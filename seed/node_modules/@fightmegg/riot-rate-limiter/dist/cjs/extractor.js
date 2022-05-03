"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMethod = exports.extractRegion = void 0;
const path_to_regexp_1 = require("path-to-regexp");
const _types_1 = require("./@types");
const matchPath = (path, url) => {
    const keys = [];
    const regexp = path_to_regexp_1.pathToRegexp(path, keys);
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
const extractRegion = (url) => {
    const uri = new URL(url);
    const didMatch = matchPath(_types_1.HOST, uri.host);
    if (didMatch)
        return didMatch.values[0];
    return null;
};
exports.extractRegion = extractRegion;
const extractMethod = (url) => {
    const path = new URL(url).pathname;
    let method = null;
    Object.keys(_types_1.METHODS).map((service) => {
        Object.entries(_types_1.METHODS[service]).some(([m, p]) => {
            if (matchPath(p, path)) {
                method = `${service}.${m}`;
                return true;
            }
        });
    });
    return method;
};
exports.extractMethod = extractMethod;
