import json
import os
import uuid
from typing import Any, Dict, List

import psycopg
import requests
from pgvector.psycopg import register_vector

DATA_PATH = os.getenv('SYMBOL_DATA', 'data/dream_symbols.json')
EMBEDDING_URL = os.getenv('EMBEDDING_API_URL', 'http://localhost:8001/embed')

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = int(os.getenv('DB_PORT', '5432'))
DB_NAME = os.getenv('DB_NAME', 'dream_decoder')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'postgres')


def load_documents(path: str) -> List[Dict[str, Any]]:
  with open(path, 'r', encoding='utf-8') as f:
    return json.load(f)


def build_text(doc: Dict[str, Any]) -> str:
  parts = [
    doc.get('symbol', ''),
    ', '.join(doc.get('categories', [])),
    doc.get('description', ''),
  ]
  parts.extend(doc.get('interpretations', []))
  parts.append(doc.get('advice', ''))
  return '\n'.join(filter(None, parts))


def embed_texts(texts: List[str]) -> List[List[float]]:
  response = requests.post(EMBEDDING_URL, json={'texts': texts}, timeout=60)
  response.raise_for_status()
  data = response.json()
  return data['embeddings']


def ensure_schema(conn: psycopg.Connection, dim: int):
  with conn.cursor() as cur:
    cur.execute('CREATE EXTENSION IF NOT EXISTS vector;')
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
      """,
    )
    cur.execute('TRUNCATE TABLE dream_symbols;')
  conn.commit()


def insert_documents(
  conn: psycopg.Connection,
  docs: List[Dict[str, Any]],
  vectors: List[List[float]],
):
  with conn.cursor() as cur:
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
          doc.get('symbol'),
          json.dumps(doc.get('categories', [])),
          doc.get('description'),
          json.dumps(doc.get('emotions', [])),
          json.dumps(doc.get('mbtiTone', {})),
          json.dumps(doc.get('interpretations', [])),
          doc.get('advice'),
          vector,
        ),
      )
  conn.commit()


def main():
  docs = load_documents(DATA_PATH)
  if not docs:
    print('No documents found.')
    return

  texts = [build_text(doc) for doc in docs]
  vectors = embed_texts(texts)

  conn = psycopg.connect(
    host=DB_HOST,
    port=DB_PORT,
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
  )
  register_vector(conn)
  ensure_schema(conn, len(vectors[0]))
  insert_documents(conn, docs, vectors)
  conn.close()
  print(f'Inserted {len(docs)} documents into dream_symbols table')


if __name__ == '__main__':
  main()
