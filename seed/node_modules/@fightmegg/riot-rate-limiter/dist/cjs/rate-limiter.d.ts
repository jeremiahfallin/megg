import Bottleneck from "bottleneck";
import { LimitType } from "./@types";
export declare const createRateLimiters: (rateLimits: {
    limits: string;
    counts: string;
}, opts: Bottleneck.ConstructorOptions) => {
    limiters?: Bottleneck[];
    main?: Bottleneck;
};
export declare const createRateLimitRetry: (limitType: LimitType[], retryAfterDefault: number, retryLimit: number) => (err: any, jobInfo: Bottleneck.EventInfoRetryable) => any;
export declare const updateRateLimiters: (rateLimiters: Bottleneck[], rateLimits: {
    limits: string;
    counts: string;
}) => Bottleneck[];
export declare const synchronizeRateLimiters: (rateLimiters: Bottleneck[], rateLimits: {
    limits: string;
    counts: string;
}, methodCounts: Bottleneck.Counts) => Promise<Bottleneck[]>;
