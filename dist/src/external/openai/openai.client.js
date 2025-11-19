"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIClient = void 0;
const common_1 = require("@nestjs/common");
const openai_request_factory_1 = require("./utils/openai.request-factory");
const openai_http_executor_1 = require("./openai.http-executor");
const openai_response_parser_1 = require("./utils/openai.response-parser");
let OpenAIClient = class OpenAIClient {
    requestFactory;
    httpExecutor;
    responseParser;
    constructor(requestFactory, httpExecutor, responseParser) {
        this.requestFactory = requestFactory;
        this.httpExecutor = httpExecutor;
        this.responseParser = responseParser;
    }
    async generateReply(message) {
        return this.generateFromMessages([
            {
                role: 'user',
                content: message,
            },
        ]);
    }
    async generateFromMessages(messages) {
        const payload = this.requestFactory.createPayloadFromMessages(messages);
        const response = await this.httpExecutor.post(this.requestFactory.getEndpoint(), this.requestFactory.createHeaders(), payload);
        return this.responseParser.parse(response);
    }
};
exports.OpenAIClient = OpenAIClient;
exports.OpenAIClient = OpenAIClient = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [openai_request_factory_1.OpenAIRequestFactory,
        openai_http_executor_1.OpenAIHttpExecutor,
        openai_response_parser_1.OpenAIResponseParser])
], OpenAIClient);
//# sourceMappingURL=openai.client.js.map