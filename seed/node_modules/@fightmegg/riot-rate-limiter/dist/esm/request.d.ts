import { RequestInit, RequestInfo } from "node-fetch";
export declare const request: ({ url, options, }: {
    url: RequestInfo;
    options?: RequestInit | undefined;
}) => Promise<{
    rateLimits: import("./@types").RateLimits;
    json: any;
}>;
