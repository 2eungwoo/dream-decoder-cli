import { Inject, Injectable } from "@nestjs/common";
import { InterpretDreamRequestDto } from "../dto/interpret-dream-request.dto";
import { DreamSymbolDto } from "../types/dream-symbol.dto";
import { ConfigType } from "@nestjs/config";
import {
  DEFAULT_INTERPRETATION_CONFIG,
  interpretationConfig,
} from "../config/interpretation.config";

interface SimilarityScore {
  symbol: number;
  action: number;
  derived: number;
  total: number;
  doc: DreamSymbolDto;
}

@Injectable()
export class InterpretationSimilarityEvaluator {
  constructor(
    @Inject(interpretationConfig.KEY)
    private readonly config: ConfigType<typeof interpretationConfig> = DEFAULT_INTERPRETATION_CONFIG
  ) {}

  public rank(
    request: InterpretDreamRequestDto,
    symbols: DreamSymbolDto[]
  ): DreamSymbolDto[] {
    const scores = symbols.map((symbol) => ({
      doc: symbol,
      ...this.calculateSimilarity(request, symbol),
    }));

    return scores.sort((a, b) => b.total - a.total).map((item) => item.doc);
  }

  private calculateSimilarity(
    request: InterpretDreamRequestDto,
    symbol: DreamSymbolDto
  ): Omit<SimilarityScore, "doc"> {
    const dreamSource = `${request.dream ?? ""} ${
      request.extraContext ?? ""
    }`.trim();
    const emotionSource = (request.emotions ?? []).join(" ").trim();
    const haystack = `${dreamSource} ${emotionSource}`.trim();

    const symbolScore = this.computeTextScore(
      haystack,
      [symbol.symbol, ...symbol.symbolMeanings],
      this.weights.symbol
    );
    const actionScore = this.computeTextScore(
      haystack,
      [symbol.action, symbol.archetypeName, symbol.archetypeId],
      this.weights.action
    );
    const derivedScore = this.computeTextScore(
      haystack,
      symbol.derivedMeanings,
      this.weights.derived
    );

    return {
      symbol: symbolScore,
      action: actionScore,
      derived: derivedScore,
      total: symbolScore + actionScore + derivedScore,
    };
  }

  private get weights() {
    return (
      this.config?.similarityWeights ??
      DEFAULT_INTERPRETATION_CONFIG.similarityWeights
    );
  }

  private computeTextScore(
    haystack: string,
    keywords: (string | undefined)[],
    maxWeight: number
  ) {
    if (!haystack || !keywords?.length || maxWeight <= 0) {
      return 0;
    }

    const normalizedHaystack = haystack.toLowerCase();
    const normalizedKeywords = keywords
      .map((keyword) => keyword?.toLowerCase().trim())
      .filter((keyword): keyword is string => Boolean(keyword));

    if (!normalizedKeywords.length) {
      return 0;
    }

    const matches = normalizedKeywords.filter((keyword) =>
      normalizedHaystack.includes(keyword)
    );

    if (!matches.length) {
      return 0;
    }

    const ratio = matches.length / normalizedKeywords.length;
    return Math.min(maxWeight, maxWeight * ratio);
  }
}
