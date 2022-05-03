import { RequestInfo } from "node-fetch";
import { PlatformId } from "./@types";
export declare const extractRegion: (url: RequestInfo) => PlatformId | null;
export declare const extractMethod: (url: RequestInfo) => string | null;
