import { GEMINI_STYLE_SPINNER_FRAMES } from "../constants/spinner-frames";

export class Spinner {
  private timer?: NodeJS.Timeout;
  private frameIndex = 0;
  private message = "";
  private lastRenderLength = 0;

  public start(message: string) {
    this.message = message;
    if (this.timer) {
      return;
    }

    this.timer = setInterval(() => {
      const frame = GEMINI_STYLE_SPINNER_FRAMES[this.frameIndex];
      this.frameIndex =
        (this.frameIndex + 1) % GEMINI_STYLE_SPINNER_FRAMES.length; // frame-idx 돌리면서 스피너 구현
      this.renderFrame(frame);
    }, 80);
  }

  public setMessage(message: string) {
    this.message = message;
    if (!this.timer) {
      return;
    }
    const frame = GEMINI_STYLE_SPINNER_FRAMES[this.frameIndex];
    this.renderFrame(frame);
  }

  public stop(finalMessage?: string) {
    if (!this.timer) {
      return;
    }

    clearInterval(this.timer);
    this.timer = undefined;

    process.stdout.write("\r");
    if (finalMessage) {
      console.log(finalMessage);
    } else {
      process.stdout.write(" ".repeat(this.lastRenderLength));
      process.stdout.write("\r");
    }

    this.frameIndex = 0;
    this.lastRenderLength = 0;
  }

  private renderFrame(frame: string) {
    const output = `${frame} ${this.message}`;
    const padded =
      output.length < this.lastRenderLength
        ? output + " ".repeat(this.lastRenderLength - output.length)
        : output;
    process.stdout.write(`\r${padded}`);
    this.lastRenderLength = padded.length;
  }
}
