import logging
import os
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer

logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)


class EmbedRequest(BaseModel):
  texts: List[str] = Field(min_length=1, description="Texts to embed")


class EmbedResponse(BaseModel):
  embeddings: List[List[float]]


def load_model():
  model_name = os.getenv('EMBEDDING_MODEL', 'jhgan/ko-sroberta-nli')
  logger.info('[==] 임베딩 모델 로드 중: %s', model_name)
  return SentenceTransformer(model_name)


app = FastAPI(title='Dream Decoder Embedding Server')
model: SentenceTransformer | None = None


@app.on_event('startup')
def startup_event():
  global model
  model = load_model()
  logger.info('[완료] 임베딩 모델 로드 완료, 요청 대기 중')


@app.get('/health')
def health():
  return {'status': 'ok'}


@app.post('/embed', response_model=EmbedResponse)
def embed_text(request: EmbedRequest):
  global model
  if model is None:
    raise HTTPException(status_code=503, detail='Model not ready')
  if len(request.texts) > int(os.getenv('MAX_TEXTS', '32')):
    raise HTTPException(status_code=400, detail='Too many texts in one request')

  logger.info('[==] 임베딩 요청 수신 (%d건)', len(request.texts))
  embeddings = model.encode(
    request.texts,
    normalize_embeddings=True,
    show_progress_bar=False,
  )
  logger.info('[완료] 임베딩 응답 반환')
  return {'embeddings': embeddings.tolist()}
