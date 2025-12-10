import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { InternalServerErrorException } from "@nestjs/common";
import { InterpretationRequestPublisher } from "./request.publisher";
import { InterpretationStatusStore } from "../status/status.store";
import { InterpretationMessageFactory } from "../messages/message.factory";
import { InterpretationStreamWriter } from "../streams/stream.writer";
import { RequestBackupStore } from "../archive/request-backup.store";
import { InterpretationMessage } from "../messages/interfaces/message.types";
import { RecoveryFailureCode } from "../recovery/recovery.types";

describe("InterpretationRequestPublisher", () => {
  let publisher: InterpretationRequestPublisher;
  const statusStore = {
    initialize: jest.fn(),
    markFailed: jest.fn(),
  };
  const messageFactory = {
    create: jest.fn(),
  };
  const streamWriter = {
    write: jest.fn() as jest.MockedFunction<
        (message: InterpretationMessage) => Promise<void>
    >,
  };
  const requestBackupStore = {
    savePendingRequest: jest.fn(),
    markBacklog: jest.fn(),
  };

  const user = { id: "user-1", username: "tester" };
  const payload = { dream: "테스트 꿈" };
  const baseMessage: InterpretationMessage = {
    requestId: "req-123",
    userId: user.id,
    username: user.username,
    payload,
    createdAt: new Date().toISOString(),
    retryCount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    messageFactory.create.mockReturnValue({ ...baseMessage });
    publisher = new InterpretationRequestPublisher(
      statusStore as unknown as InterpretationStatusStore,
      messageFactory as unknown as InterpretationMessageFactory,
      streamWriter as unknown as InterpretationStreamWriter,
      requestBackupStore as unknown as RequestBackupStore
    );
  });

  it("request가 stream에 적재 성공하면 requestid 리턴", async () => {
    // given & when
    streamWriter.write.mockResolvedValueOnce(undefined);
    const result = await publisher.publish(user, payload);

    // then
    expect(statusStore.initialize).toHaveBeenCalledWith(
      baseMessage.requestId,
      user,
      payload
    );
    expect(requestBackupStore.savePendingRequest).toHaveBeenCalledWith(
      expect.objectContaining({ requestId: baseMessage.requestId })
    );
    expect(streamWriter.write).toHaveBeenCalledWith(
      expect.objectContaining({ requestId: baseMessage.requestId })
    );
    expect(result).toEqual({ requestId: baseMessage.requestId });
  });

  it("stream 적재 실패시 backlog/failed 처리", async () => {
    // given & when
    const error = new Error("redis unavailable");
    streamWriter.write.mockRejectedValueOnce(error);

    // then
    // todo : 예외처리 더 의미있게
    await expect(publisher.publish(user, payload))
    .rejects.toBeInstanceOf(InternalServerErrorException);

    // then
    expect(requestBackupStore.markBacklog).toHaveBeenCalledWith(
      baseMessage.requestId,
      error.message,
      RecoveryFailureCode.STREAM_WRITE_FAILED,
      expect.any(Date),
      baseMessage.retryCount + 1
    );
    expect(statusStore.markFailed).toHaveBeenCalledWith(
      baseMessage.requestId,
      "<!> 해몽 요청 스트림에 기록하지 못했습니다. 자동 복구를 시도합니다."
    );
  });
});
