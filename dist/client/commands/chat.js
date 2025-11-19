"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = handleChat;
const api_1 = require("../api");
const output_1 = require("../ui/output");
async function handleChat(args, sessions) {
    const session = sessions.get();
    if (!session) {
        console.log('<!> 로그인이 필요합니다.');
        return;
    }
    const message = args.join(' ');
    if (!message) {
        console.log('Usage: chat <message>');
        return;
    }
    const data = await (0, api_1.postApi)('/chat', {
        username: session.username,
        password: session.password,
        message,
    });
    (0, output_1.printResponse)(data);
}
//# sourceMappingURL=chat.js.map