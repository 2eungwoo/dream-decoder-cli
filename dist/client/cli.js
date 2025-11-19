"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:readline/promises"));
const chalk_1 = __importDefault(require("chalk"));
const banner_1 = require("./ui/banner");
const output_1 = require("./ui/output");
const session_store_1 = require("./sessions/session-store");
const register_1 = require("./commands/register");
const login_1 = require("./commands/login");
const logout_1 = require("./commands/logout");
const chat_1 = require("./commands/chat");
const interpret_1 = require("./commands/interpret");
async function main() {
    const rl = promises_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const sessions = new session_store_1.SessionStore();
    printIntro();
    try {
        while (true) {
            const input = (await rl.question(chalk_1.default.hex('#4CC9F0')('dream-decoder> '))).trim();
            if (!input) {
                continue;
            }
            const [command, ...args] = input.split(/\s+/);
            if (command === '/quit') {
                break;
            }
            const ask = (prompt) => rl.question(prompt);
            await dispatchCommand(command, args, sessions, ask);
        }
    }
    finally {
        rl.close();
    }
}
function printIntro() {
    console.log(chalk_1.default.cyanBright(banner_1.ASCII_LOGO));
    console.log(chalk_1.default.magentaBright('Welcome, Dream Decoder CLI! type help for commands, /quit to exit.'));
    console.log(chalk_1.default.blueBright(banner_1.COMMANDS_BOX));
}
async function dispatchCommand(command, args, sessions, ask) {
    switch (command) {
        case 'register':
            return (0, register_1.handleRegister)(args);
        case 'login':
            return (0, login_1.handleLogin)(args, sessions);
        case 'logout':
            return (0, logout_1.handleLogout)(args, sessions);
        case 'chat':
            return (0, chat_1.handleChat)(args, sessions);
        case 'interpret':
            return (0, interpret_1.handleInterpret)(async (prompt) => {
                const response = await ask(chalk_1.default.hex('#F72585')(prompt));
                return response;
            }, sessions);
        case 'help':
            return (0, output_1.printUsage)();
        default:
            console.log('Unknown command. type help for list.');
    }
}
main().catch((err) => {
    console.error('CLI failure', err);
    process.exitCode = 1;
});
//# sourceMappingURL=cli.js.map