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
  border: (text) => chalk.hex("#4895EF")(text),
  title: (text) => chalk.hex("#F72585").bold(text),
  sectionTitle: (text) => chalk.hex("#4CC9F0").bold(text),
  text: (text) => chalk.white(text),
  muted: (text) => chalk.hex("#A0A1B8")(text),
  bullet: (text) => chalk.hex("#F3722C").bold(text),
  highlight: (text) => chalk.hex("#B5179E").bold(text),
};
