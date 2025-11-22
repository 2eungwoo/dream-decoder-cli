import logging
from typing import List

import requests # type: ignore

logger = logging.getLogger(__name__)


class EmbeddingService:
  """embedding api 호출"""

  def __init__(self, api_url: str):
    self.api_url = api_url

  def embed(self, texts: List[str]) -> List[List[float]]:
    logger.info("[==] %d건 임베딩을 %s 로 요청합니다", len(texts), self.api_url)
    response = requests.post(self.api_url, json={"texts": texts}, timeout=60)
    response.raise_for_status()
    data = response.json()
    embeddings = data.get("embeddings", [])
    if embeddings:
      logger.info("[==] 임베딩 응답 완료 (차원=%d)", len(embeddings[0]))
    else:
      logger.warning("[!!] 임베딩 응답이 비었습니다")
    return embeddings
