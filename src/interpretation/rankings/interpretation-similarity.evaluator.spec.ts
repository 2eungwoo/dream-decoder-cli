import { describe, it, expect } from "@jest/globals";
import { InterpretationSimilarityEvaluator } from "./interpretation-similarity.evaluator";
import { DreamSymbolDto } from "../types/dream-symbol.dto";

function buildSymbol(partial: Partial<DreamSymbolDto>): DreamSymbolDto {
  return {
    archetypeId: "FRUIT",
    archetypeName: "과일",
    symbol: "기본",
    symbolMeanings: [],
    action: "관찰한다",
    derivedMeanings: [],
    advice: "",
    ...partial,
  };
}

describe("InterpretationSimilarityEvaluator", () => {
  const evaluator = new InterpretationSimilarityEvaluator();

  it("꿈 본문에 상징이 직접 등장하면 높은 점수를 받는다", () => {
    const request = {
      dream: "사과를 따서 나눠 먹었어요",
    } as any;

    const strong = buildSymbol({
      symbol: "사과",
      symbolMeanings: ["선택", "책임"],
    });
    const weak = buildSymbol({
      symbol: "포도",
      symbolMeanings: ["협력"],
    });

    const ranked = evaluator.rank(request, [weak, strong]);
    expect(ranked[0].symbol).toBe("사과");
  });

  it("행동(action) 키워드가 매칭되면 가점을 준다", () => {
    const request = {
      dream: "과일을 먹는다",
    } as any;

    const eat = buildSymbol({
      symbol: "포도",
      action: "먹는다",
    });
    const drop = buildSymbol({
      symbol: "포도",
      action: "버린다",
    });

    const ranked = evaluator.rank(request, [drop, eat]);
    expect(ranked[0].action).toBe("먹는다");
  });

  it("매칭이 없으면 입력 순서를 유지한다", () => {
    const request = {
      dream: "관련 없는 장면",
    } as any;

    const docs = [
      buildSymbol({ symbol: "A" }),
      buildSymbol({ symbol: "B" }),
    ];

    const ranked = evaluator.rank(request, docs);
    expect(ranked.map((doc) => doc.symbol)).toEqual(["A", "B"]);
  });
});
