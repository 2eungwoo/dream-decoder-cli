from unittest.mock import MagicMock
from src.services.dream_symbol_ingestor import DreamSymbolIngestor

# 전체 오케스트레이션만 패스하도록 일단 추가
# 리팩토링 더 있을거같으면 각각 다시 추가예정
def test_ingestor_runs_all_steps():
  loader = MagicMock()
  loader.load.return_value = [{"symbol": "물", "interpretations": []}]

  embed_service = MagicMock()
  embed_service.embed.return_value = [[0.1, 0.2]]

  repository = MagicMock()

  ingestor = DreamSymbolIngestor(loader, embed_service, repository).run()
  # ingestor.run()

  loader.load.assert_called_once()
  embed_service.embed.assert_called_once()
  repository.connect.assert_called_once()
  repository.ensure_schema.assert_called_once()
  repository.insert_documents.assert_called_once()
  repository.close.assert_called_once()
