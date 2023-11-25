const ChatStorageService = require("../../src/services/ChatStorageService");

describe("ChatStorageService TestCases", () => {
  beforeEach(() => {
    ChatStorageService.resetChatHistory("user@example.com");
  });

  test("should add chat to history", () => {
    const email = "user@example.com";
    const message = "I feel sick";
    const response = "Please be detailed.";

    ChatStorageService.addChat(email, message, response);

    const history = ChatStorageService.getHistoryOfChat(email);
    expect(history).toHaveLength(1);
    expect(history[0].message).toBe(message);
    expect(history[0].response).toBe(response);
  });

  test("should return empty chat history if no chat is added", () => {
    const email = "user@example.com";

    const history = ChatStorageService.getHistoryOfChat(email);
    expect(history).toHaveLength(0);
  });

  test("should reset chat history", () => {
    const email = "user@example.com";
    const message = "I feel sick";
    const response = "Please be detailed.";

    ChatStorageService.addChat(email, message, response);
    ChatStorageService.resetChatHistory(email);

    const history = ChatStorageService.getHistoryOfChat(email);
    expect(history).toHaveLength(0);
  });

});
