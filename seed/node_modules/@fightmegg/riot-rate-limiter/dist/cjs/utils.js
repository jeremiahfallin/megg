"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRateLimits = exports.toNumber = exports.secsToMs = exports.chainRateLimiters = exports.createJobOptions = exports.createRateLimiterOptions = void 0;
const bottleneck_1 = __importDefault(require("bottleneck"));
const defaultRateLimiterOptions = {
    maxConcurrent: 1,
    strategy: bottleneck_1.default.strategy.OVERFLOW,
};
const createRateLimiterOptions = (limit, count, options) => {
    const limits = limit.split(":").map(exports.toNumber);
    const counts = count.split(":").map(exports.toNumber);
    if (!limits.length || limits.length < 2)
        throw new Error("invalid rate limits");
    return {
        ...defaultRateLimiterOptions,
        ...(options || {}),
        reservoir: limits[0] - (counts[0] || 0),
        reservoirRefreshAmount: limits[0],
        reservoirRefreshInterval: exports.secsToMs(limits[1]),
        minTime: exports.secsToMs(limits[1]) / limits[0],
    };
};
exports.createRateLimiterOptions = createRateLimiterOptions;
const createJobOptions = (options = {}) => ({
    id: String(Date.now()),
    ...options,
    weight: 1,
});
exports.createJobOptions = createJobOptions;
const chainRateLimiters = (rl) => {
    for (let i = rl.length - 1; i >= 0; i--) {
        if (rl[i - 1])
            rl[i - 1].chain(rl[i]);
    }
    return rl;
};
exports.chainRateLimiters = chainRateLimiters;
const secsToMs = (secs) => secs * 1000;
exports.secsToMs = secsToMs;
const toNumber = (n) => Number(n);
exports.toNumber = toNumber;
const extractRateLimits = (headers) => ({
    appLimits: headers.get("X-App-Rate-Limit") || "10:10,500:600",
    appCounts: headers.get("X-App-Rate-Limit-Count") || "1:10,1:600",
    methodLimits: headers.get("X-Method-Rate-Limit") || "",
    methodCounts: headers.get("X-Method-Rate-Limit-Count") || "",
    retryAfter: exports.secsToMs(exports.toNumber(headers.get("Retry-After") || "")),
    limitType: headers.get("X-Rate-Limit-Type"),
});
exports.extractRateLimits = extractRateLimits;
