"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TOCGenerator {
    constructor(d) {
        this.data = this.getData(d);
    }
    getTOCSubHeaderHTML(name) {
        return `
    <div class="font-semibold text-gray-700">
      <a href="#model-${name}">${name}</a>
    </div>
   `;
    }
    getSubFieldHTML(identifier, root, field) {
        return `<li><a href="#${identifier}-${root}-${field}">${field}</a></li>`;
    }
    toHTML() {
        return `
        <div>
          <h5 class="mb-2 font-bold"><a href="#models">Models</a></h5>
          <ul class="mb-2 ml-1">
              ${this.data.models
            .map((model) => `
            <li class="mb-4">
                ${this.getTOCSubHeaderHTML(model.name)}
                  <div class="mt-1 ml-2">
                    <div class="mb-1 font-medium text-gray-600"><a href="#model-${model.name}-fields">Fields</a></div>
                      <ul class="pl-3 ml-1 border-l-2 border-gray-400">
                      ${model.fields
            .map((field) => this.getSubFieldHTML('model', model.name, field))
            .join('')}
                      </ul>
                  </div>
                  <div class="mt-2 ml-2">
                    <div class="mb-1 font-medium text-gray-600"><a href="#model-${model.name}-operations">Operations</a></div>
                    <ul class="pl-3 ml-1 border-l-2 border-gray-400">
                    ${model.operations
            .map((op) => this.getSubFieldHTML('model', model.name, op))
            .join('')}
                    </ul>
                  </div>
            </li>
              `)
            .join('')}
            </ul>
          <h5 class="mt-12 mb-2 font-bold"><a href="#types">Types</a></h5>
          <ul class="mb-2 ml-1">
            <li class="mb-4">
              <div class="font-semibold text-gray-700">
                <a href="#input-types">Input Types</a>
              </div>
              <ul class="pl-3 ml-1 border-l-2 border-gray-400">
              ${this.data.types.inputTypes
            .map((inputType) => this.getSubFieldHTML('type', 'inputType', inputType))
            .join('')}
              </ul>
            </li>
            <li class="mb-4">
              <div class="font-semibold text-gray-700">
                <a href="#output-types">Output Types</a>
              </div>
              <ul class="pl-3 ml-1 border-l-2 border-gray-400">
              ${this.data.types.outputTypes
            .map((outputType) => this.getSubFieldHTML('type', 'outputType', outputType))
            .join('')}
              </ul>
            </li>
          </ul>
        </div>
    `;
    }
    getModels(dmmfModel, mappings) {
        return dmmfModel.map((model) => {
            var _a;
            return {
                name: model.name,
                fields: model.fields.map((field) => field.name),
                operations: Object.keys((_a = mappings.find((x) => x.model === model.name)) !== null && _a !== void 0 ? _a : {}).filter((op) => op !== 'model'),
            };
        });
    }
    getTypes(dmmfSchema) {
        return {
            inputTypes: dmmfSchema.inputObjectTypes.prisma.map((inputType) => inputType.name),
            outputTypes: [
                ...dmmfSchema.outputObjectTypes.model.map((ot) => ot.name),
                ...dmmfSchema.outputObjectTypes.prisma
                    .map((outputType) => outputType.name)
                    .filter((ot) => ot !== 'Query' && ot !== 'Mutation'),
            ],
        };
    }
    getData(d) {
        return {
            models: this.getModels(d.datamodel.models, d.mappings),
            types: this.getTypes(d.schema),
        };
    }
}
exports.default = TOCGenerator;
//# sourceMappingURL=toc.js.map