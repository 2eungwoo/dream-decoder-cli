# /data/dream_symbols.json 데이터 스키마 정의를 위한 상수값 관리 파일
# 모든 필드명을 상수로 관리하도록 바꿨으므로 .json 변경 시 이 파일만 수정하면 되도록 구성 
# 참고로 nest-app 은 별도임

# 임베딩 생성에 쓰는 필드명
TEXT_FIELDS_FOR_EMBEDDING = [
    "symbol",
    "categories",
    "description",
    "interpretations",
    "advice",
]

# db 스키마 매핑되는 상수깂 정의
ALL_DB_FIELDS = [
    "id",
    "symbol",
    "categories",
    "description",
    "emotions",
    "mbti_tone",
    "interpretations",
    "advice",
    "embedding",
]

# 원본 .json에서 db 삽입할 필드랑 기본값 매핑
DOCUMENT_TO_DB_MAP = {
    "symbol": None,
    "categories": [],
    "description": None,
    "emotions": [],
    "mbtiTone": {},
    "interpretations": [],
    "advice": None,
}
