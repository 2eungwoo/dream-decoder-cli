"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogin = handleLogin;
const api_1 = require("../api");
const output_1 = require("../ui/output");
async function handleLogin(args, sessions) {
    const [username, password] = args;
    if (!username || !password) {
        console.log('Usage: login <username> <password>');
        return;
    }
    const data = await (0, api_1.postApi)('/auth/login', {
        username,
        password,
    });
    (0, output_1.printResponse)(data);
    if (data.success) {
        sessions.set({ username, password });
    }
}
//# sourceMappingURL=login.js.map