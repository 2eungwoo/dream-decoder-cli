import json
import logging
import uuid
from typing import Any, Dict, List

import psycopg
from pgvector.psycopg import register_vector

from src.config import DbConfig

logger = logging.getLogger(__name__)

class DreamSymbolRepository:
  """pgvector repository 스키마/데이터 세팅"""

  def __init__(self, config: DbConfig):
    self.config = config
    self.conn: psycopg.Connection | None = None

  def connect(self):
    if self.conn is None:
      self.conn = psycopg.connect(
        host=self.config.host,
        port=self.config.port,
        dbname=self.config.name,
        user=self.config.user,
        password=self.config.password,
      )
      register_vector(self.conn)

  def close(self):
    if self.conn:
      self.conn.close()
      self.conn = None

  def ensure_schema(self, dim: int):
    if self.conn is None:
      raise RuntimeError("Connection is not initialized")

    logger.info("[==] dream_symbols 테이블 스키마 검사 (벡터 차원=%d)", dim)
    with self.conn.cursor() as cur:
      cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
      cur.execute(
        f"""
        CREATE TABLE IF NOT EXISTS dream_symbols (
          id UUID PRIMARY KEY,
          symbol TEXT,
          categories JSONB,
          description TEXT,
          emotions JSONB,
          mbti_tone JSONB,
          interpretations JSONB,
          advice TEXT,
          embedding VECTOR({dim})
        );
        """
      )
      cur.execute("TRUNCATE TABLE dream_symbols;")
    self.conn.commit()

  def insert_documents(self, docs: List[Dict[str, Any]], vectors: List[List[float]]):
    if self.conn is None:
      raise RuntimeError("Connection is not initialized")

    logger.info("[==] dream_symbols 테이블에 %d건 적재 시작", len(docs))
    with self.conn.cursor() as cur:
      for doc, vector in zip(docs, vectors):
        cur.execute(
          """
          INSERT INTO dream_symbols (
            id, symbol, categories, description, emotions,
            mbti_tone, interpretations, advice, embedding
          ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
          """,
          (
            str(uuid.uuid4()),
            doc.get("symbol"),
            json.dumps(doc.get("categories", [])),
            doc.get("description"),
            json.dumps(doc.get("emotions", [])),
            json.dumps(doc.get("mbtiTone", {})),
            json.dumps(doc.get("interpretations", [])),
            doc.get("advice"),
            vector,
          ),
        )
    self.conn.commit()
