import { describe, it, expect } from "@jest/globals";
import { InterpretationSimilarityEvaluator } from "./interpretation-similarity.evaluator";
import { DreamSymbolDto } from "../types/dream-symbol.dto";

function buildSymbol(partial: Partial<DreamSymbolDto>): DreamSymbolDto {
  return {
    archetypeId: "FRUIT",
    archetypeName: "과일",
    coreMeanings: [],
    symbolExamples: [],
    symbol: "기본",
    symbolMeanings: [],
    scenarioTitle: "기본 시나리오",
    scenarioDerivedMeanings: [],
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

  it("아키타입 핵심어 혹은 심볼 예시가 일치하면 가점을 준다", () => {
    const request = {
      dream: "작은 강아지가 따라다녔어요",
    } as any;

    const dog = buildSymbol({
      archetypeName: "동물",
      archetypeId: "ANIMAL",
      symbolExamples: ["강아지", "고양이"],
      symbol: "강아지",
    });
    const city = buildSymbol({
      archetypeName: "장소",
      archetypeId: "PLACE",
      symbolExamples: ["도시"],
      symbol: "도시",
    });

    const ranked = evaluator.rank(request, [city, dog]);
    expect(ranked[0].symbol).toBe("강아지");
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
