import os
import psycopg # type: ignore

SQL = """
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS dream_symbols (
  id UUID PRIMARY KEY,
  symbol TEXT,
  categories JSONB,
  description TEXT,
  emotions JSONB,
  mbti_tone JSONB,
  interpretations JSONB,
  advice TEXT,
  embedding VECTOR(768)
);
"""

conn = psycopg.connect(
    host=os.getenv("DB_HOST", "localhost"),
    port=int(os.getenv("DB_PORT", "5432")),
    dbname=os.getenv("DB_NAME", "dream_decoder"),
    user=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASSWORD", "postgres"),
)
with conn.cursor() as cur:
    cur.execute(SQL)
conn.commit()
conn.close()
print("init schema 완료 : dream_symbols 스키마 생성, 이제 임베딩 하시면 됩니다.")
