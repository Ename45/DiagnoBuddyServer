const SessionHelper = require("../../src/helpers/SessionHelper");
const ChatStorageService = require("../../src/services/ChatStorageService");

jest.mock("../../src/services/ChatStorageService", () => ({
  getHistoryOfChat: jest.fn(),
}));

describe("SessionHelper TestCases", () => {
  test("should return existing user session ID if chat history exists", () => {
    const mockUserChatInfo = [
      { sessionId: "sessionId1" },
      { sessionId: "sessionId2" },
    ];
    jest
      .spyOn(ChatStorageService, "getHistoryOfChat")
      .mockReturnValueOnce(mockUserChatInfo);

    const sessionId =
      SessionHelper.getExistingUserSessionId("test@example.com");
    expect(sessionId).toBe("sessionId2");
  });
  

  test("should return null if user has no chat history", () => {
    jest.spyOn(ChatStorageService, "getHistoryOfChat").mockReturnValueOnce([]);

    const sessionId =
      SessionHelper.getExistingUserSessionId("test@example.com");
    expect(sessionId).toBeNull();
  });
});
