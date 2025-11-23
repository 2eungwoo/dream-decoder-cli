import chalk from "chalk";
import { getApi } from "../api";
import { SessionStore } from "../sessions/session-store";

interface InterpretationListItem {
  id: string;
  dream: string;
  createdAt: string;
}

export async function handleShowList(args: string[], sessions: SessionStore) {
  const session = sessions.get();
  if (!session) {
    console.log("<!> 먼저 /login 명령으로 로그인 해주세요.");
    return;
  }

  const response = await getApi<InterpretationListItem[]>("/interpret/logs", {
    headers: {
      "x-username": session.username,
      "x-password": session.password,
    },
  });

  if (!response.success || !response.data) {
    console.error(
      chalk.red(response.message ?? "<!> 해몽 기록을 불러오지 못했습니다.")
    );
    return;
  }

  if (!response.data.length) {
    console.log("<!> 저장된 해몽 기록이 없습니다.");
    return;
  }

  console.log(chalk.cyanBright("\n[Saved Interpretation List]"));
  response.data.forEach((item) => {
    const date = new Date(item.createdAt);
    const formatted = `${date.getFullYear()}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
    console.log(
      chalk.gray(`${formatted} | ${chalk.white(item.id)} | ${item.dream}`)
    );
  });
  console.log();
}
