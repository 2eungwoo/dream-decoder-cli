import { postApi } from '../api';
import { printResponse } from '../ui/output';
import { SessionStore } from '../sessions/session-store';

type QuestionFn = (prompt: string) => Promise<string>;

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

export async function handleInterpret(ask: QuestionFn, sessions: SessionStore) {
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

  const extraContext = (
    await ask('Additional context or recent events (optional):\n> ')
  ).trim();

  const data = await postApi<{
    interpretation: string;
    references: unknown[];
  }>('/interpret', {
    dream,
    emotions,
    mbti,
    extraContext,
  });

  printResponse(data);
}

async function askEmotionSelections(ask: QuestionFn) {
  const instructions = `
Select emotions (comma-separated numbers or custom text).
${formatOptions(EMOTION_OPTIONS)}
예: 2,4 또는 "기쁨, 긴장" (비워두면 건너뜁니다)
> `;
  const input = (await ask(instructions)).trim();
  return parseMultiSelection(input, EMOTION_OPTIONS);
}

async function askMbtiSelection(ask: QuestionFn) {
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

function formatOptions(options: string[]) {
  return options
    .map((option, idx) => `${idx + 1}. ${option}`)
    .join('  ');
}

function parseMultiSelection(input: string, options: string[]) {
  if (!input) {
    return [];
  }
  const tokens = input
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);

  const selected: string[] = [];
  for (const token of tokens) {
    const index = Number(token);
    if (!Number.isNaN(index) && options[index - 1]) {
      selected.push(options[index - 1]);
    } else if (options.includes(token)) {
      selected.push(token);
    } else {
      selected.push(token);
    }
  }
  return Array.from(new Set(selected));
}

function parseSingleSelection(input: string, options: string[]) {
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
