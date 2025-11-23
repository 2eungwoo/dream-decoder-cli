import { Injectable } from "@nestjs/common";
import { InterpretDreamRequestDto } from "../dto/interpret-dream-request.dto";
import { DreamSymbolDto } from "../types/dream-symbol.dto";
import { INTERPRETATION_USER_GUIDANCE } from "./interpretation-user-prompt.guidance";

@Injectable()
export class InterpretationUserPromptBuilder {
  public buildUserPrompt(
    request: InterpretDreamRequestDto,
    symbols: DreamSymbolDto[]
  ) {
    const normalizedMbti = request.mbti?.toUpperCase();

    const formattedSymbols = symbols
      .map((symbol) => this.formatSymbol(symbol, normalizedMbti))
      .filter(Boolean)
      .join("\n\n");

    const parts = [
      `Dream narrative:\n${request.dream.trim()}`,
      this.optionalLine("Dreamer emotions", request.emotions?.join(", ")),
      this.optionalLine("Dreamer MBTI", normalizedMbti),
      this.optionalLine("Additional context", request.extraContext?.trim()),
      "Symbol insights to weave into the response:",
      formattedSymbols || "No prior references found.",
      INTERPRETATION_USER_GUIDANCE,
    ];

    return parts.filter(Boolean).join("\n\n");
  }

  private formatSymbol(symbol: DreamSymbolDto, mbti?: string): string {
    const tone = this.resolveTone(symbol, mbti);
    const interpretations = symbol.interpretations?.length
      ? symbol.interpretations.map((line) => `- ${line}`).join("\n")
      : null;

    const lines = [
      `Symbol: ${symbol.symbol}`,
      this.optionalLine("Categories", symbol.categories?.join(", ")),
      this.optionalLine("Description", symbol.description),
      this.optionalLine("Emotions", symbol.emotions?.join(", ")),
      this.optionalLine("Suggested Tone", tone),
      interpretations ? `Interpretations:\n${interpretations}` : null,
      this.optionalLine("Advice", symbol.advice),
    ];

    return lines.filter(Boolean).join("\n");
  }

  private resolveTone(symbol: DreamSymbolDto, mbti?: string): string | null {
    if (!symbol.mbtiTone) return null;

    if (mbti && symbol.mbtiTone[mbti]) {
      return symbol.mbtiTone[mbti];
    }

    return symbol.mbtiTone.DEFAULT || null;
  }

  private optionalLine(label: string, value?: string | null): string | null {
    if (!value || !value.trim()) return null;
    return `${label}: ${value.trim()}`;
  }
}
