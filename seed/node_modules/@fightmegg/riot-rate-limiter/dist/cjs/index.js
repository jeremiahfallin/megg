"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiotRateLimiter = exports.PlatformId = exports.HOST = exports.METHODS = exports.extractRegion = exports.extractMethod = void 0;
const _types_1 = require("./@types");
Object.defineProperty(exports, "PlatformId", { enumerable: true, get: function () { return _types_1.PlatformId; } });
Object.defineProperty(exports, "METHODS", { enumerable: true, get: function () { return _types_1.METHODS; } });
Object.defineProperty(exports, "HOST", { enumerable: true, get: function () { return _types_1.HOST; } });
const extractor_1 = require("./extractor");
Object.defineProperty(exports, "extractMethod", { enumerable: true, get: function () { return extractor_1.extractMethod; } });
Object.defineProperty(exports, "extractRegion", { enumerable: true, get: function () { return extractor_1.extractRegion; } });
const rate_limiter_1 = require("./rate-limiter");
const request_1 = require("./request");
const utils_1 = require("./utils");
const debug = require("debug")("riotratelimiter:main");
const debugQ = require("debug")("riotratelimiter:queue");
class RiotRateLimiter {
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
            this.rateLimiters[region] = rate_limiter_1.createRateLimiters({
                limits: rateLimits.appLimits,
                counts: rateLimits.appCounts,
            }, this.getRateLimiterOptions(region));
            this.rateLimiters[region].main.on("failed", rate_limiter_1.createRateLimitRetry([_types_1.LimitType.APPLICATION], this.configuration.retryAfterDefault, this.configuration.retryCount));
        }
        if (!((_a = this.rateLimiters[region]) === null || _a === void 0 ? void 0 : _a[method]) && rateLimits.methodLimits) {
            debug("Setting up rateLimiter for", region, method);
            this.rateLimiters[region][method] = rate_limiter_1.createRateLimiters({
                limits: rateLimits.methodLimits,
                counts: rateLimits.methodCounts,
            }, this.getRateLimiterOptions(`${region}_${method}`));
            this.rateLimiters[region][method].main.on("failed", rate_limiter_1.createRateLimitRetry([_types_1.LimitType.METHOD, _types_1.LimitType.SERVICE], this.configuration.retryAfterDefault, this.configuration.retryCount));
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
            this.rateLimiters[region].limiters = rate_limiter_1.updateRateLimiters(this.rateLimiters[region].limiters, { limits: rateLimits.appLimits, counts: rateLimits.appCounts });
        }
        if ((_a = this.rateLimiters[region]) === null || _a === void 0 ? void 0 : _a[method]) {
            debug("Updating rateLimiter for", region, method);
            this.rateLimiters[region][method].limiters = rate_limiter_1.updateRateLimiters(this.rateLimiters[region][method].limiters, { limits: rateLimits.methodLimits, counts: rateLimits.methodCounts });
        }
    }
    async syncRateLimiters(region, method, rateLimits) {
        var _a;
        debug("Syncing Rate Limiters", region, method);
        if ((_a = this.rateLimiters[region]) === null || _a === void 0 ? void 0 : _a[method]) {
            this.rateLimiters[region].limiters = await rate_limiter_1.synchronizeRateLimiters(this.rateLimiters[region].limiters, { limits: rateLimits.appLimits, counts: rateLimits.appCounts }, this.rateLimiters[region][method].main.counts());
            this.rateLimiters[region][method].limiters =
                await rate_limiter_1.synchronizeRateLimiters(this.rateLimiters[region][method].limiters, { limits: rateLimits.methodLimits, counts: rateLimits.methodCounts }, this.rateLimiters[region][method].main.counts());
        }
        return;
    }
    async execute(req, jobOptions) {
        var _a, _b;
        const region = extractor_1.extractRegion(req.url);
        const method = extractor_1.extractMethod(req.url);
        if (!region || !method)
            throw new Error(`unsupported region: ${region} or method: ${method}`);
        debug("Request:", req.url, "region:", region, "method:", method);
        const limiter = (_b = (_a = this.rateLimiters) === null || _a === void 0 ? void 0 : _a[region]) === null || _b === void 0 ? void 0 : _b[method];
        if (!limiter) {
            debug("No limiters setup yet, sending inital request");
            return this.executeRequest({ req, region, method }, utils_1.createJobOptions(jobOptions));
        }
        return limiter.main.schedule(utils_1.createJobOptions(jobOptions), () => this.executeRequest({ req, region, method }));
    }
    executeRequest({ req, region, method }, jobOptions) {
        return new Promise((resolve, reject) => {
            request_1.request(req)
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
exports.RiotRateLimiter = RiotRateLimiter;
