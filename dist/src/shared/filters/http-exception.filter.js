"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalHttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const api_response_dto_1 = require("../dto/api-response.dto");
let GlobalHttpExceptionFilter = class GlobalHttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const { status, message, errors } = this.normalizeException(exception);
        response
            .status(status)
            .json(api_response_dto_1.ApiResponseFactory.error(message, status, errors));
    }
    normalizeException(exception) {
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();
            const message = (typeof response === 'object'
                ? response.message
                : undefined) ?? exception.message;
            return {
                status,
                message: Array.isArray(message) ? message.join(', ') : message,
                errors: response,
            };
        }
        if (exception instanceof Error) {
            return {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: exception.message,
                errors: undefined,
            };
        }
        return {
            status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            errors: exception,
        };
    }
};
exports.GlobalHttpExceptionFilter = GlobalHttpExceptionFilter;
exports.GlobalHttpExceptionFilter = GlobalHttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalHttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map