import { DMMFDocument } from './transformDMMF';
export interface Generatable<T> {
    data: T;
    toHTML(): string;
    getData(d: DMMFDocument): T;
}
export declare function capitalize(str: string): string;
export declare function lowerCase(name: string): string;
export declare function isScalarType(type: string): boolean;
