import { Generatable } from '../generator/helpers';
import { DMMFDocument } from '../generator/transformDMMF';
export default class HTMLPrinter implements Generatable<DMMFDocument> {
    data: DMMFDocument;
    constructor(d: DMMFDocument);
    getPrismaSvg(): string;
    getHead(csspath: string): string;
    getData(d: DMMFDocument): DMMFDocument;
    toHTML(): string;
}
