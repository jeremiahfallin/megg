import { LimitType, PlatformId, METHODS, HOST, } from "./@types";
import { extractMethod, extractRegion } from "./extractor";
import { createRateLimiters, createRateLimitRetry, synchronizeRateLimiters, updateRateLimiters, } from "./rate-limiter";
import { request } from "./request";
import { createJobOptions } from "./utils";
const debug = require("debug")("riotratelimiter:main");
const debugQ = require("debug")("riotratelimiter:queue");
export { extractMethod, extractRegion, METHODS, HOST, PlatformId };
export class RiotRateLimiter {
    constructor(config = {}) {
        this.configuration = {
            debug: false,
            concurrency: 1,
            retryAfterDefault: 5000,
            retryCount: 4,
            datastore: "local",
        };
        this.rateLimiters = {};
        this.configuration = { ...this.configuration, ...config };
        this.checkConcurrency();
    }
    checkConcurrency() {
        if (this.configuration.concurrency > 10)
            console.warn("Concurrency > 10 is quite high, be careful!");
    }
    getRateLimiterOptions(id) {
        return {
            id,
            maxConcurrent: this.configuration.concurrency,
            datastore: this.configuration.datastore,
            clientOptions: this.configuration.redis || null,
        };
    }
    setupRateLimiters(region, method, rateLimits) {
        var _a;
        if (!this.rateLimiters[region] && rateLimits.appLimits) {
            debug("Setting up rateLimiter for", region);
            this.rateLimiters[region] = createRateLimiters({
                limits: rateLimits.appLimits,
                counts: rateLimits.appCounts,
            }, this.getRateLimiterOptions(region));
            this.rateLimiters[region].main.on("failed", createRateLimitRetry([LimitType.APPLICATION], this.configuration.retryAfterDefault, this.configuration.retryCount));
        }
        if (!((_a = this.rateLimiters[region]) === null || _a === void 0 ? void 0 : _a[method]) && rateLimits.methodLimits) {
            debug("Setting up rateLimiter for", region, method);
            this.rateLimiters[region][method] = createRateLimiters({
                limits: rateLimits.methodLimits,
                counts: rateLimits.methodCounts,
            }, this.getRateLimiterOptions(`${region}_${method}`));
            this.rateLimiters[region][method].main.on("failed", createRateLimitRetry([LimitType.METHOD, LimitType.SERVICE], this.configuration.retryAfterDefault, this.configuration.retryCount));
            // TEMP DEBUG
            this.rateLimiters[region][method].main.on("debug", (msg) => {
                debugQ(region, method, msg, this.rateLimiters[region][method].main.counts());
            });
        }
    }
    updateRateLimiters(region, method, rateLimits) {
        var _a;
        if (this.rateLimiters[region]) {
            debug("Updating rateLimiter for", region);
            this.rateLimiters[region].limiters = updateRateLimiters(this.rateLimiters[region].limiters, { limits: rateLimits.appLimits, counts: rateLimits.appCounts });
        }
        if ((_a = this.rateLimiters[region]) === null || _a === void 0 ? void 0 : _a[method]) {
            debug("Updating rateLimiter for", region, method);
            this.rateLimiters[region][method].limiters = updateRateLimiters(this.rateLimiters[region][method].limiters, { limits: rateLimits.methodLimits, counts: rateLimits.methodCounts });
        }
    }
    async syncRateLimiters(region, method, rateLimits) {
        var _a;
        debug("Syncing Rate Limiters", region, method);
        if ((_a = this.rateLimiters[region]) === null || _a === void 0 ? void 0 : _a[method]) {
            this.rateLimiters[region].limiters = await synchronizeRateLimiters(this.rateLimiters[region].limiters, { limits: rateLimits.appLimits, counts: rateLimits.appCounts }, this.rateLimiters[region][method].main.counts());
            this.rateLimiters[region][method].limiters =
                await synchronizeRateLimiters(this.rateLimiters[region][method].limiters, { limits: rateLimits.methodLimits, counts: rateLimits.methodCounts }, this.rateLimiters[region][method].main.counts());
        }
        return;
    }
    async execute(req, jobOptions) {
        var _a, _b;
        const region = extractRegion(req.url);
        const method = extractMethod(req.url);
        if (!region || !method)
            throw new Error(`unsupported region: ${region} or method: ${method}`);
        debug("Request:", req.url, "region:", region, "method:", method);
        const limiter = (_b = (_a = this.rateLimiters) === null || _a === void 0 ? void 0 : _a[region]) === null || _b === void 0 ? void 0 : _b[method];
        if (!limiter) {
            debug("No limiters setup yet, sending inital request");
            return this.executeRequest({ req, region, method }, createJobOptions(jobOptions));
        }
        return limiter.main.schedule(createJobOptions(jobOptions), () => this.executeRequest({ req, region, method }));
    }
    executeRequest({ req, region, method }, jobOptions) {
        return new Promise((resolve, reject) => {
            request(req)
                .then(({ rateLimits, json }) => {
                this.setupRateLimiters(region, method, rateLimits);
                this.syncRateLimiters(region, method, rateLimits).finally(() => resolve(json));
            })
                .catch(({ rateLimits, status, statusText, resp, }) => {
                var _a, _b;
                if (status !== 429)
                    return reject(resp);
                const limiter = (_b = (_a = this.rateLimiters) === null || _a === void 0 ? void 0 : _a[region]) === null || _b === void 0 ? void 0 : _b[method];
                if (limiter) {
                    this.updateRateLimiters(region, method, rateLimits);
                    return reject({ status, statusText, ...rateLimits });
                }
                this.setupRateLimiters(region, method, rateLimits);
                setTimeout(() => {
                    resolve(this.rateLimiters[region][method].main.schedule(jobOptions, () => this.executeRequest({
                        req,
                        region,
                        method,
                    })));
                }, rateLimits.retryAfter || this.configuration.retryAfterDefault);
            });
        });
    }
}
