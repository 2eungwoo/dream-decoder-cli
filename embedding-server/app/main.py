import os
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer


class EmbedRequest(BaseModel):
  texts: List[str] = Field(min_length=1, description="Texts to embed")


class EmbedResponse(BaseModel):
  embeddings: List[List[float]]


def load_model():
  model_name = os.getenv('EMBEDDING_MODEL', 'jhgan/ko-sroberta-nli')
  return SentenceTransformer(model_name)


app = FastAPI(title='Dream Decoder Embedding Server')
model: SentenceTransformer | None = None


@app.on_event('startup')
def startup_event():
  global model
  model = load_model()


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

  embeddings = model.encode(
    request.texts,
    normalize_embeddings=True,
    show_progress_bar=False,
  )
  return {'embeddings': embeddings.tolist()}
