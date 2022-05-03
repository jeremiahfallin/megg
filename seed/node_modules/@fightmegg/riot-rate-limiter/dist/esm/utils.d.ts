import Bottleneck from "bottleneck";
import { Headers } from "node-fetch";
import { RateLimits } from "./@types";
export declare const createRateLimiterOptions: (limit: string, count: string, options?: Bottleneck.ConstructorOptions | undefined) => Bottleneck.ConstructorOptions;
export declare const createJobOptions: (options?: Bottleneck.JobOptions) => Bottleneck.JobOptions;
export declare const chainRateLimiters: (rl: Bottleneck[]) => Bottleneck[];
export declare const secsToMs: (secs: number) => number;
export declare const toNumber: (n: string) => number;
export declare const extractRateLimits: (headers: Headers) => RateLimits;
