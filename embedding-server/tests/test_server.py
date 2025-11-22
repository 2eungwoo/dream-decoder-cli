import os
from fastapi.testclient import TestClient # type: ignore
from src.server import app 

# 모델 로딩 속도 때문에 임시로 다른 모델 사용
os.environ["EMBEDDING_MODEL"] = "sentence-transformers/paraphrase-MiniLM-L3-v2"

client = TestClient(app)

# 테스트코드 연습
def test_health_endpoint():
  response = client.get("/health")
  assert response.status_code == 200
  assert response.json() == {"status": "ok"}


def test_embed_endpoint():
  payload = {"texts": ["꿈에서 푸른 바다를 봤어요"]}
  response = client.post("/embed", json=payload)
  assert response.status_code == 200
  data = response.json()
  assert "embeddings" in data
  assert isinstance(data["embeddings"], list)
  assert len(data["embeddings"][0]) > 0
