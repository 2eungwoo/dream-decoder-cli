import { Injectable } from "@nestjs/common";
import { InterpretDreamRequestDto } from "../dto/interpret-dream-request.dto";
import { DreamSymbolDto } from "../types/dream-symbol.dto";

interface SimilarityScore {
  symbol: number;
  action: number;
  derived: number;
  total: number;
  doc: DreamSymbolDto;
}

@Injectable()
export class InterpretationSimilarityEvaluator {
  private readonly symbolWeight = 0.5;
  private readonly actionWeight = 0.3;
  private readonly derivedWeight = 0.2;

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
      this.symbolWeight
    );
    const actionScore = this.computeTextScore(
      haystack,
      [symbol.action, symbol.archetypeName, symbol.archetypeId],
      this.actionWeight
    );
    const derivedScore = this.computeTextScore(
      haystack,
      symbol.derivedMeanings,
      this.derivedWeight
    );

    return {
      symbol: symbolScore,
      action: actionScore,
      derived: derivedScore,
      total: symbolScore + actionScore + derivedScore,
    };
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
