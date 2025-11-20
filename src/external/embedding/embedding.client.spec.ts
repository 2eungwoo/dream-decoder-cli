import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigType } from "@nestjs/config";
import { EmbeddingClient } from "./embedding.client";
import { embeddingConfig } from "./embedding.config";

describe("EmbeddingClient", () => {
  let client: EmbeddingClient;
  const configMock: ConfigType<typeof embeddingConfig> = {
    apiUrl: "http://embedding/api",
    timeoutMs: 1000,
  };
  const TEXTS = ["꿈 내용"];

  const originalFetch = global.fetch;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmbeddingClient,
        {
          provide: embeddingConfig.KEY,
          useValue: configMock,
        },
      ],
    }).compile();

    client = module.get(EmbeddingClient);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("embedding-server 호출되고 vector 리턴하는 동작 검증", async () => {
    const fetchMock: jest.MockedFunction<typeof fetch> = jest.fn();
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ embeddings: [[0.1, 0.2]] }),
    } as Response);
    // jest 테스트러너가 Response 타입을 모르니 이렇게 반환객체를 캐스팅해서 쓰도록 할 수 있다고 함
    // 근데 이게 맞는걸까..흠..

    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await client.embed(TEXTS);

    expect(fetchMock).toHaveBeenCalledWith(
      configMock.apiUrl,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ texts: TEXTS }),
      })
    );
    expect(result).toEqual([[0.1, 0.2]]);
  });

  it("빈 입력값이면 빈 배열 리턴되는지 검증", async () => {
    const result = await client.embed([]);
    expect(result).toEqual([]);
  });
});
