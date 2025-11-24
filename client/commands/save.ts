import chalk from "chalk";
import { postApi } from "../api";
import { SessionStore } from "../sessions/session-store";

interface SaveInterpretationPayload {
  dream: string;
  emotions: string[];
  mbti?: string;
  extraContext?: string;
  interpretation: string;
}

type AskFn = (prompt: string) => Promise<string>;

export async function saveInterpretationOrNot(
  ask: AskFn,
  sessions: SessionStore,
  payload: SaveInterpretationPayload
) {
  const session = sessions.get();
  if (!session) {
    return;
  }

  let attempt = 0;
  const maxAttempts = 3;
  while (attempt < maxAttempts) {
    const confirmation = (
      await ask(chalk.gray("이 해몽 결과를 저장할까요? (y/n) "))
    )
      ?.trim()
      .toLowerCase();

    if (!confirmation) {
      attempt += 1;
      console.log(chalk.yellow("<!> 값을 입력해주세요."));
      continue;
    }

    if (confirmation === "y" || confirmation.startsWith("y")) {
      break;
    }

    if (confirmation === "n" || confirmation.startsWith("n")) {
      console.log(chalk.gray("저장을 건너뜁니다."));
      return;
    }

    attempt += 1;
    console.log(chalk.yellow("<!> y 또는 n으로 입력해 주세요. (예: y)"));
  }

  if (attempt >= maxAttempts) {
    console.log(chalk.yellow("<!> 입력이 없어 저장을 건너뜁니다."));
    return;
  }

  const response = await postApi<{ id: string }>(
    "/interpret/logs",
    {
      dream: payload.dream,
      emotions: payload.emotions,
      mbti: payload.mbti,
      extraContext: payload.extraContext,
      interpretation: payload.interpretation,
    },
    {
      headers: {
        "x-username": session.username,
        "x-password": session.password,
      },
    }
  );

  if (!response.success) {
    console.error(
      chalk.red(response.message ?? "<!> 해몽 기록 저장에 실패했습니다.")
    );
    return;
  }

  console.log(
    chalk.greenBright(
      `해몽 기록이 저장되었습니다. ID: ${response.data?.id ?? ""}`
    )
  );
}
