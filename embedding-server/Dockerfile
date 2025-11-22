FROM python:3.11-slim AS base
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./requirements.txt
COPY scripts/requirements.txt ./scripts/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir -r scripts/requirements.txt

COPY src ./src
COPY scripts ./scripts

EXPOSE 8001
CMD ["uvicorn", "src.server:app", "--host", "0.0.0.0", "--port", "8001"]
