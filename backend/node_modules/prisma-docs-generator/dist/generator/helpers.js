"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isScalarType = exports.lowerCase = exports.capitalize = void 0;
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}
exports.capitalize = capitalize;
function lowerCase(name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
}
exports.lowerCase = lowerCase;
const primitiveTypes = [
    'String',
    'Boolean',
    'Int',
    'Float',
    'Json',
    'DateTime',
    'Null',
];
function isScalarType(type) {
    return primitiveTypes.includes(type);
}
exports.isScalarType = isScalarType;
//# sourceMappingURL=helpers.js.map