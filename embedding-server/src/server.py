import logging
import os
from typing import List

from fastapi import FastAPI, HTTPException # type: ignore
from pydantic import BaseModel, Field # type: ignore
from sentence_transformers import SentenceTransformer # type: ignore

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

# 임베딩 모델 : ko-sroberta-nli
# https://huggingface.co/jhgan/ko-sroberta-nli
# https://github.com/jhgan00/ko-sentence-transformers
def load_model():
  model_name = os.getenv("EMBEDDING_MODEL", "jhgan/ko-sroberta-nli")
  logger.info("[==] 임베딩 모델 로드 중: %s", model_name)
  return SentenceTransformer(model_name)


# FastAPI가 BaseModel을 기반으로 RequestBody/ResponseModel 자동 매핑해줌
# POST: /embed 요청에서 texts 배열 받고, 최소 1개 포함 
class EmbedRequest(BaseModel):
  texts: List[str] = Field(min_length=1, description="Texts to embed")

# FastAPI가 BaseModel을 기반으로 RequestBody/ResponseModel 자동 매핑해줌
# POST: /embed 응답으로 임베딩된 벡터 배열 리턴 
# 각 텍스타맏 하나의 벡터 리스트 매핑
class EmbedResponse(BaseModel):
  embeddings: List[List[float]]


app = FastAPI(title="Dream Decoder Embedding Server")
model: SentenceTransformer | None = None


@app.on_event("startup")
def startup_event():
  global model
  model = load_model()
  logger.info("[완료] 임베딩 모델 로드 완료, 요청 대기 중")


@app.get("/health")
def health():
  return {"status": "ok"}


@app.post("/embed", response_model=EmbedResponse)
def embed_text(request: EmbedRequest):
  global model
  if model is None:
    raise HTTPException(status_code=503, detail="Model not ready")
  if len(request.texts) > int(os.getenv("MAX_TEXTS", "32")):
    raise HTTPException(
      status_code=400, detail="Too many texts in one request"
    )

  logger.info("[==] 임베딩 요청 수신 (%d건)", len(request.texts))
  embeddings = model.encode(
    request.texts,
    normalize_embeddings=True,
    show_progress_bar=False,
  )
  logger.info("[완료] 임베딩 응답 반환")
  return {"embeddings": embeddings.tolist()}
