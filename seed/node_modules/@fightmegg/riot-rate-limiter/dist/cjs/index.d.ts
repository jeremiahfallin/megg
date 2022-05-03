import Bottleneck from "bottleneck";
import { ConstructorParams, ExecuteParameters, PlatformId, METHODS, HOST } from "./@types";
import { extractMethod, extractRegion } from "./extractor";
export { extractMethod, extractRegion, METHODS, HOST, PlatformId };
export declare class RiotRateLimiter {
    readonly configuration: {
        debug: boolean;
        concurrency: number;
        retryAfterDefault: number;
        retryCount: number;
        redis?: Bottleneck.RedisConnectionOptions;
        datastore: "local" | "ioredis";
    };
    readonly rateLimiters: {
        [key: string]: any;
    };
    constructor(config?: ConstructorParams);
    private checkConcurrency;
    private getRateLimiterOptions;
    private setupRateLimiters;
    private updateRateLimiters;
    private syncRateLimiters;
    execute(req: ExecuteParameters, jobOptions?: Bottleneck.JobOptions): Promise<any>;
    private executeRequest;
}
