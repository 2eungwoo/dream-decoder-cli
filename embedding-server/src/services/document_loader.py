import json
import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class DocumentLoader:
    """/data/dream_symbols.json 문서 로딩 + 아키타입 단위 문서를 시나리오 문서로 확장"""

    def __init__(self, path: str):
        self.path = path

    def load(self) -> List[Dict[str, Any]]:
        logger.info("[==] 꿈 심볼 JSON을 로딩합니다: %s", self.path)
        with open(self.path, "r", encoding="utf-8") as f:
            raw_docs = json.load(f)
        documents = self._expand_documents(raw_docs)
        logger.info("[==] 총 %d건의 시나리오 문서를 생성했습니다", len(documents))
        return documents

    def _expand_documents(self, raw_docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        expanded: List[Dict[str, Any]] = []
        for entry in raw_docs:
            archetype = entry.get("archetype") or {}
            symbol_lookup = {
                (symbol.get("symbol") or "").strip(): symbol
                for symbol in entry.get("symbols") or []
                if symbol.get("symbol")
            }
            for scenario in entry.get("scenarios") or []:
                symbol_name = (
                    (scenario.get("symbol") or "").strip()
                    or (scenario.get("title") or "").strip()
                )
                symbol_info = symbol_lookup.get(symbol_name, {})
                expanded.append(
                    {
                        "archetypeId": archetype.get("id"),
                        "archetypeName": archetype.get("name"),
                        "coreMeanings": archetype.get("coreMeaning") or [],
                        "symbolExamples": archetype.get("symbolExamples") or [],
                        "symbol": symbol_name,
                        "symbolMeanings": symbol_info.get("meanings") or [],
                        "scenarioTitle": scenario.get("title"),
                        "scenarioDerivedMeanings": scenario.get("derivedMeanings")
                        or [],
                        "advice": scenario.get("advice"),
                    }
                )
        return expanded
