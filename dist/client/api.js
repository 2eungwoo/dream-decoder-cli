"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postApi = postApi;
const BASE_URL = process.env.API_URL ?? 'http://localhost:3000';
async function postApi(route, payload) {
    try {
        const response = await fetch(`${BASE_URL}${route}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return (await response.json());
    }
    catch (error) {
        return {
            success: false,
            message: error.message ?? 'Unknown error',
            code: 0,
            errors: error,
        };
    }
}
//# sourceMappingURL=api.js.map