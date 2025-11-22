from typing import Dict, Any


# embedding 대상 텍스트 생성해서 RAG로 쓸 문서화
def build_text(doc: Dict[str, Any]) -> str:
  parts = [
    doc.get("symbol", ""),
    ", ".join(doc.get("categories", [])),
    doc.get("description", ""),
  ]
  parts.extend(doc.get("interpretations", []))
  parts.append(doc.get("advice", ""))
  return "\n".join(filter(None, parts))
