"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRegister = handleRegister;
const api_1 = require("../api");
const output_1 = require("../ui/output");
async function handleRegister(args) {
    const [username, password] = args;
    if (!username || !password) {
        console.log('Usage: register <username> <password>');
        return;
    }
    const data = await (0, api_1.postApi)('/auth/register', {
        username,
        password,
    });
    (0, output_1.printResponse)(data);
}
//# sourceMappingURL=register.js.map