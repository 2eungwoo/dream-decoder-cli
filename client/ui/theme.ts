import chalk from "chalk";

export interface CliTheme {
  border: (text: string) => string;
  title: (text: string) => string;
  sectionTitle: (text: string) => string;
  text: (text: string) => string;
  muted: (text: string) => string;
  bullet: (text: string) => string;
  highlight: (text: string) => string;
}

export const cliTheme: CliTheme = {
  border: (text) => chalk.hex("#A8A8A8")(text), // 연한 그레이
  title: (text) => chalk.hex("#FFFFFF").bold(text), // 화이트(볼드)
  sectionTitle: (text) => chalk.hex("#8EE0F0")(text), // 파스텔 시안
  text: (text) => chalk.hex("#F2F2F2")(text), // 라이트 그레이
  muted: (text) => chalk.hex("#8C8C8C")(text), // 흐린 회색
  bullet: (text) => chalk.hex("#F2C94C")(text), // 파스텔 옐로우
  highlight: (text) => chalk.hex("#6FCF97").bold(text), // 파스텔 그린
};
