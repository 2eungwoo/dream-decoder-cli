import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { mock, instance, when, verify, anything } from "ts-mockito";
import { beforeEach, describe, expect, it } from "@jest/globals";

import { InterpretationService } from "./interpretation.service";
import { EmbeddingInputFactory } from "./factories/embedding-input.factory";
import { EmbeddingClient } from "../external/embedding/embedding.client";
import { DreamSymbolRepository } from "./datasources/dream-symbol.repository";
import { InterpretationPromptBuilder } from "./prompts/interpretation-prompt.builder";
import { OpenAIClient } from "../external/openai/openai.client";
import { InvalidDreamException } from "./exceptions/invalid-dream.exception";

describe("InterpretationService (ts-mockito)", () => {
  let service: InterpretationService;

  const embeddingInputFactoryMock = mock(EmbeddingInputFactory);
  const embeddingClientMock = mock(EmbeddingClient);
  const symbolRepositoryMock = mock(DreamSymbolRepository);
  const promptBuilderMock = mock(InterpretationPromptBuilder);
  const openAIClientMock = mock(OpenAIClient);

  const REQUEST = {
    dream: "이상한 복도를 걸어다녔어요",
    emotions: ["혼란"],
    mbti: "INFJ",
    extraContext: "새 직장 준비 중",
  };

  const RESPONSE = "해몽 결과는 어쩌구 저쩌구 입니다";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterpretationService,
        {
          provide: EmbeddingInputFactory,
          useValue: instance(embeddingInputFactoryMock),
        },
        { provide: EmbeddingClient, useValue: instance(embeddingClientMock) },
        {
          provide: DreamSymbolRepository,
          useValue: instance(symbolRepositoryMock),
        },
        {
          provide: InterpretationPromptBuilder,
          useValue: instance(promptBuilderMock),
        },
        { provide: OpenAIClient, useValue: instance(openAIClientMock) },
      ],
    }).compile();

    service = module.get(InterpretationService);
  });

  it("사용자 요청 embedding + vectordb 검색 + LLM 호출 오케스트레이션이 이루어져야함", async () => {
    // given & when
    when(
      embeddingInputFactoryMock.createFromRequest(REQUEST as any)
    ).thenReturn("embedding-input"); // embedding 요청 전달
    when(embeddingClientMock.embed(anything())).thenResolve([[0.1, 0.2, 0.3]]); // 대충 임베딩된 벡터
    when(
      symbolRepositoryMock.findNearestByEmbedding(anything(), anything())
    ).thenResolve([{ symbol: "끝없는 복도를 걷는 꿈" } as never]); // 벡터검색 결과
    when(promptBuilderMock.buildPrompt(anything(), anything())).thenReturn(
      "formatted prompt"
    ); // 위 내용으로 formatted prompt 만들었다고 가정

    when(openAIClientMock.generateFromMessages(anything())).thenResolve(
      RESPONSE
    );

    // then
    const response = await service.interpret(REQUEST as never);

    verify(embeddingInputFactoryMock.createFromRequest(REQUEST as any)).once();
    verify(embeddingClientMock.embed(anything())).once();
    verify(
      symbolRepositoryMock.findNearestByEmbedding(anything(), anything())
    ).once();
    verify(promptBuilderMock.buildPrompt(anything(), anything())).once();
    verify(openAIClientMock.generateFromMessages(anything())).once();

    expect(response.success).toBe(true);
    expect(response.data?.interpretation).toBe(RESPONSE);
  });

  it("꿈 내용이 비면 InvalidDreamException 터짐", async () => {
    // given
    const BLANK_REQUEST = "";

    // when & then
    await expect(
      service.interpret({ dream: BLANK_REQUEST } as never)
    ).rejects.toBeInstanceOf(InvalidDreamException);
  });
});
