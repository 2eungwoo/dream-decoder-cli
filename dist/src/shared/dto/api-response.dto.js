"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseFactory = void 0;
class ApiResponseFactory {
    static success(data, message) {
        return {
            success: true,
            message,
            data,
        };
    }
    static error(message, code, errors) {
        return {
            success: false,
            message,
            code,
            errors,
        };
    }
}
exports.ApiResponseFactory = ApiResponseFactory;
//# sourceMappingURL=api-response.dto.js.map