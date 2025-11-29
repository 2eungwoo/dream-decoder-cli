import os
import psycopg # type: ignore

SQL_TABLE = """
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS dream_symbols (
  id UUID PRIMARY KEY,
  archetype_id TEXT,
  archetype_name TEXT,
  symbol TEXT,
  symbol_meanings JSONB,
  action TEXT,
  derived_meanings JSONB,
  advice TEXT,
  embedding VECTOR(768)
);
"""

SQL_INDEX = """
CREATE INDEX IF NOT EXISTS dream_symbols_embedding_idx ON dream_symbols USING hnsw (embedding vector_cosine_ops);
"""

conn = psycopg.connect(
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", "5432")),
    dbname=os.getenv("DB_NAME", "dream_decoder"),
    user=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASSWORD", "postgres"),
)
with conn.cursor() as cur:
    cur.execute(SQL_TABLE)
    print("[init_schema.py] dream_symbols 테이블 스키마 확인/생성 완료")

    print("[init_schema.py] HNSW 인덱스 확인/생성 시작... (시간이 다소 소요될 수 있습니다)")
    cur.execute(SQL_INDEX)

conn.commit()
conn.close()
print("[init_schema.py] 스키마 생성 완료 with HNSW 인덱스")
print("임베딩 수행을 위해 다음 명령어를 실행해주세요")
print("PYTHONPATH=embedding-server python3 embedding-server/scripts/run_ingest.py")
