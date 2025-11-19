"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_client_1 = require("./openai.client");
const openai_config_1 = require("./openai.config");
const openai_http_executor_1 = require("./openai.http-executor");
const openai_request_factory_1 = require("./utils/openai.request-factory");
const openai_response_parser_1 = require("./utils/openai.response-parser");
let OpenAIModule = class OpenAIModule {
};
exports.OpenAIModule = OpenAIModule;
exports.OpenAIModule = OpenAIModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forFeature(openai_config_1.openAIConfig)],
        providers: [
            openai_client_1.OpenAIClient,
            openai_request_factory_1.OpenAIRequestFactory,
            openai_http_executor_1.OpenAIHttpExecutor,
            openai_response_parser_1.OpenAIResponseParser,
        ],
        exports: [openai_client_1.OpenAIClient],
    })
], OpenAIModule);
//# sourceMappingURL=openai.module.js.map