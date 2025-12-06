import "reflect-metadata";
import { Test, TestingModule } from "@nestjs/testing";
import { beforeEach, describe, expect, it } from "@jest/globals";
import { instance, mock, reset, verify, when } from "ts-mockito";

import { InterpretationLlmService } from "./interpretation-llm.service";
import { OpenAIClient } from "../../external/openai/openai.client";

describe("InterpretationLlmService", () => {
  let service: InterpretationLlmService;
  const openAiClientMock = mock(OpenAIClient);

  const MESSAGES = [
    { role: "system", content: "sys" },
    { role: "user", content: "usr" },
  ];
  const RESPONSE = "해몽 결과";

  beforeEach(async () => {
    reset(openAiClientMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterpretationLlmService,
        { provide: OpenAIClient, useValue: instance(openAiClientMock) },
      ],
    }).compile();

    service = module.get(InterpretationLlmService);
  });

  it("openAI 호출해서 응답받아온느지 테스트", async () => {
    // given & when
    when(openAiClientMock.generateFromMessages(MESSAGES as any))
    .thenResolve(RESPONSE);

    const result = await service.generate(MESSAGES as any);

    // then
    expect(result).toBe(RESPONSE);
    verify(openAiClientMock.generateFromMessages(MESSAGES as any)).once();
  });
});
