"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogout = handleLogout;
const api_1 = require("../api");
const output_1 = require("../ui/output");
async function handleLogout(args, sessions) {
    let [username, password] = args;
    if (!username || !password) {
        const session = sessions.get();
        if (!session) {
            console.log('Usage: logout <username> <password> (or login first)');
            return;
        }
        ({ username, password } = session);
    }
    const data = await (0, api_1.postApi)('/auth/logout', {
        username,
        password,
    });
    (0, output_1.printResponse)(data);
    if (data.success) {
        sessions.clear();
    }
}
//# sourceMappingURL=logout.js.map