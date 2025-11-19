"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInterpret = handleInterpret;
const api_1 = require("../api");
const output_1 = require("../ui/output");
const EMOTION_OPTIONS = [
    '기쁨',
    '설렘',
    '불안',
    '무서움',
    '분노',
    '슬픔',
    '당황',
    '안도',
];
const MBTI_OPTIONS = [
    'ISTJ',
    'ISFJ',
    'INFJ',
    'INTJ',
    'ISTP',
    'ISFP',
    'INFP',
    'INTP',
    'ESTP',
    'ESFP',
    'ENFP',
    'ENTP',
    'ESTJ',
    'ESFJ',
    'ENFJ',
    'ENTJ',
];
async function handleInterpret(ask, sessions) {
    const session = sessions.get();
    if (!session) {
        console.log('먼저 login 명령으로 로그인 해주세요.');
        return;
    }
    const dream = (await ask('\nDescribe your dream:\n> ')).trim();
    if (!dream) {
        console.log('꿈 내용을 입력해주세요.');
        return;
    }
    const emotions = await askEmotionSelections(ask);
    const mbti = await askMbtiSelection(ask);
    const extraContext = (await ask('Additional context or recent events (optional):\n> ')).trim();
    const data = await (0, api_1.postApi)('/interpret', {
        dream,
        emotions,
        mbti,
        extraContext,
    });
    (0, output_1.printResponse)(data);
}
async function askEmotionSelections(ask) {
    const instructions = `
Select emotions (comma-separated numbers or custom text).
${formatOptions(EMOTION_OPTIONS)}
예: 2,4 또는 "기쁨, 긴장" (비워두면 건너뜁니다)
> `;
    const input = (await ask(instructions)).trim();
    return parseMultiSelection(input, EMOTION_OPTIONS);
}
async function askMbtiSelection(ask) {
    const instructions = `
Choose your MBTI type (number or text, Enter to skip).
${formatOptions(MBTI_OPTIONS)}
예: 11 또는 ENFP
> `;
    const input = (await ask(instructions)).trim();
    if (!input) {
        return undefined;
    }
    return parseSingleSelection(input, MBTI_OPTIONS);
}
function formatOptions(options) {
    return options
        .map((option, idx) => `${idx + 1}. ${option}`)
        .join('  ');
}
function parseMultiSelection(input, options) {
    if (!input) {
        return [];
    }
    const tokens = input
        .split(',')
        .map((token) => token.trim())
        .filter(Boolean);
    const selected = [];
    for (const token of tokens) {
        const index = Number(token);
        if (!Number.isNaN(index) && options[index - 1]) {
            selected.push(options[index - 1]);
        }
        else if (options.includes(token)) {
            selected.push(token);
        }
        else {
            selected.push(token);
        }
    }
    return Array.from(new Set(selected));
}
function parseSingleSelection(input, options) {
    const normalized = input.toUpperCase();
    const index = Number(normalized);
    if (!Number.isNaN(index) && options[index - 1]) {
        return options[index - 1];
    }
    if (options.includes(normalized)) {
        return normalized;
    }
    return normalized;
}
//# sourceMappingURL=interpret.js.map