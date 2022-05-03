"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.synchronizeRateLimiters = exports.updateRateLimiters = exports.createRateLimitRetry = exports.createRateLimiters = void 0;
const bottleneck_1 = __importDefault(require("bottleneck"));
const utils_1 = require("./utils");
const createRateLimiters = (rateLimits, opts) => {
    const { limits, counts } = rateLimits;
    const limitsArr = limits.split(",");
    const countsArr = counts.split(",");
    const rateLimiters = {};
    rateLimiters.limiters = limitsArr.map((limit, index) => new bottleneck_1.default(utils_1.createRateLimiterOptions(limit, countsArr[index], {
        ...opts,
        id: `${opts.id}_${index}`,
    })));
    rateLimiters.limiters = utils_1.chainRateLimiters(rateLimiters.limiters);
    rateLimiters.main = rateLimiters.limiters[0];
    return rateLimiters;
};
exports.createRateLimiters = createRateLimiters;
const createRateLimitRetry = (limitType, retryAfterDefault, retryLimit) => (err, jobInfo) => {
    if (jobInfo.retryCount >= retryLimit - 1)
        return;
    if (err.status === 429) {
        if (Array.isArray(limitType) && limitType.includes(err.limitType))
            return err.retryAfter;
        else
            return err.retryAfter || retryAfterDefault;
    }
};
exports.createRateLimitRetry = createRateLimitRetry;
const updateRateLimiters = (rateLimiters, rateLimits) => {
    const { limits, counts } = rateLimits;
    const limitsArr = limits.split(",");
    const countsArr = counts.split(",");
    return rateLimiters.map((limiter, index) => {
        limiter.updateSettings(utils_1.createRateLimiterOptions(limitsArr[index], countsArr[index]));
        return limiter;
    });
};
exports.updateRateLimiters = updateRateLimiters;
const synchronizeRateLimiters = async (rateLimiters, rateLimits, methodCounts) => {
    const { limits, counts } = rateLimits;
    const limitsArr = limits.split(",");
    const countsArr = counts.split(",");
    const requestsInFlight = methodCounts.EXECUTING;
    return Promise.all(rateLimiters.map(async (limiter, index) => {
        const currentReservoir = await limiter.currentReservoir();
        if (!currentReservoir)
            return limiter;
        const newRateLimits = utils_1.createRateLimiterOptions(limitsArr[index], countsArr[index]);
        const rateLimitsLeftFromRiot = newRateLimits.reservoir || 0;
        const newReservoir = rateLimitsLeftFromRiot - requestsInFlight;
        limiter.updateSettings({ reservoir: newReservoir });
        return limiter;
    }));
};
exports.synchronizeRateLimiters = synchronizeRateLimiters;
