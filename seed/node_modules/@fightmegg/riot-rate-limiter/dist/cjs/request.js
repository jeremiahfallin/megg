"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const utils_1 = require("./utils");
const request = async ({ url, options, }) => {
    const resp = await node_fetch_1.default(url, options);
    const rateLimits = utils_1.extractRateLimits(resp.headers);
    const { status, statusText } = resp;
    if (resp.status >= 400)
        throw { rateLimits, status, statusText, resp };
    const json = await resp.json();
    return { rateLimits, json };
};
exports.request = request;
