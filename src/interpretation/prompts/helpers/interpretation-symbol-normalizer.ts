import { DreamSymbolDto } from "../../types/dream-symbol.dto";
import { InterpretationPromptLimits } from "../../config/interpretation.config";

export interface NormalizedSymbolBlock {
  archetypeId: string;
  archetypeName: string;
  symbol: string;
  action?: string;
  symbolMeanings: string[];
  derivedMeanings: string[];
  advice?: string;
}

export class InterpretationSymbolNormalizer {
  constructor(private readonly limits: InterpretationPromptLimits) {}

  public normalize(symbol: DreamSymbolDto): NormalizedSymbolBlock {
    return {
      archetypeId: symbol.archetypeId,
      archetypeName: symbol.archetypeName,
      symbol: symbol.symbol,
      action: symbol.action,
      symbolMeanings: this.limitList(
        symbol.symbolMeanings,
        this.limits.symbolMeanings
      ),
      derivedMeanings: this.limitList(
        symbol.derivedMeanings,
        this.limits.derivedMeanings
      ),
      advice: this.truncate(symbol.advice, this.limits.adviceLength),
    };
  }

  private limitList(values: string[], limit: number) {
    if (!values?.length || limit <= 0) {
      return [];
    }
    return values.filter(Boolean).slice(0, limit);
  }

  private truncate(text: string | undefined, limit: number) {
    if (!text) {
      return undefined;
    }
    if (text.length <= limit) {
      return text.trim();
    }
    return `${text.slice(0, limit).trim()}…`;
  }
}
