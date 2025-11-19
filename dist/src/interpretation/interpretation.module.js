"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterpretationModule = void 0;
const common_1 = require("@nestjs/common");
const interpretation_controller_1 = require("./interpretation.controller");
const interpretation_service_1 = require("./interpretation.service");
const embedding_module_1 = require("../external/embedding/embedding.module");
const openai_module_1 = require("../external/openai/openai.module");
const embedding_input_factory_1 = require("./factories/embedding-input.factory");
const dream_symbol_repository_1 = require("./datasources/dream-symbol.repository");
const interpretation_prompt_builder_1 = require("./prompts/interpretation-prompt.builder");
let InterpretationModule = class InterpretationModule {
};
exports.InterpretationModule = InterpretationModule;
exports.InterpretationModule = InterpretationModule = __decorate([
    (0, common_1.Module)({
        imports: [embedding_module_1.EmbeddingModule, openai_module_1.OpenAIModule],
        controllers: [interpretation_controller_1.InterpretationController],
        providers: [
            interpretation_service_1.InterpretationService,
            embedding_input_factory_1.EmbeddingInputFactory,
            dream_symbol_repository_1.DreamSymbolRepository,
            interpretation_prompt_builder_1.InterpretationPromptBuilder,
        ],
    })
], InterpretationModule);
//# sourceMappingURL=interpretation.module.js.map