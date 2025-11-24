import chalk from "chalk";
import { ApiResponse } from "../../src/shared/dto/api-response.dto";
import { printPanel } from "./layout";
import { COMMANDS_BOX } from "client/constants/banner";

export function printResponse<T>(res: ApiResponse<T>) {
  const CLIENT_ERROR = 400;
  const SERVER_ERROR = 500;
  if (!res.success) {
    const color =
      res.code >= CLIENT_ERROR && res.code < SERVER_ERROR
        ? chalk.yellow
        : chalk.red;
    console.error(color(`<!> Error (${res.code}): ${res.message}`));
    return;
  }

  if (res.message) {
    console.log(res.message);
  }

  const data = res.data ?? ({} as Record<string, unknown>);
  if (isInterpretationData(data)) {
    printPanel("Dream Interpretation", [
      {
        title: "해몽 결과",
        lines: [data.interpretation],
      },
    ]);
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

export function printUsage() {
  console.log(COMMANDS_BOX);
}

function isChatData(data: Record<string, unknown>): data is { reply: string } {
  return typeof data.reply === "string";
}

function isInterpretationData(data: Record<string, unknown>): data is {
  interpretation: string;
} {
  return typeof data.interpretation === "string";
}
