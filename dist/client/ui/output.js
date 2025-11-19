"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printResponse = printResponse;
exports.printUsage = printUsage;
const chalk_1 = __importDefault(require("chalk"));
function printResponse(res) {
    if (!res.success) {
        const color = res.code >= 400 && res.code < 500 ? chalk_1.default.hex('#FFA500') : chalk_1.default.red;
        console.error(color(`Error (${res.code}): ${res.message}`));
        return;
    }
    if (res.message) {
        console.log(res.message);
    }
    const data = res.data ?? {};
    if (isInterpretationData(data)) {
        console.log(chalk_1.default.cyanBright('\n[Dream Interpretation]\n'));
        console.log(data.interpretation);
        if (data.references?.length) {
            console.log(chalk_1.default.gray('\n[Related Symbols]'));
            data.references.forEach((ref, idx) => {
                console.log(chalk_1.default.gray(`${idx + 1}. ${ref.symbol} | ${ref.categories?.join(', ') || 'N/A'}`));
            });
        }
        return;
    }
    if (isChatData(data)) {
        console.log(data.reply);
        return;
    }
    if (Object.keys(data).length > 0) {
        console.log(JSON.stringify(data, null, 2));
    }
}
function printUsage() {
    console.log(`Commands:
  register <username> <password>
  login <username> <password>
  logout <username> <password>
  chat <message>
  interpret
  help
  /quit
`);
}
function isChatData(data) {
    return typeof data.reply === 'string';
}
function isInterpretationData(data) {
    return typeof data.interpretation === 'string';
}
//# sourceMappingURL=output.js.map