const ChatService = require("../../src/services/ChatService");
const ChatStorageService = require("../../src/services/ChatStorageService");
const UserSessionTracker = require("../../src/services/UserSessionTracker")


jest.spyOn(global, "fetch");

const emailNotSent = "No email provided";
const emptyMessageErrorMessage =
  "I apologize for any confusion, but I'm unable to provide any assistance without a clear description of your symptoms or health concerns. If you're experiencing any specific symptoms or have any health-related questions, please let me know, and I'll do my best to help you.";

describe("ChatService TestCases", () => {
  const originalConsoleError = console.error;
  const realDateNow = Date.now.bind(global.Date);

  beforeAll(() => {
    console.error = jest.fn();
    global.Date.now = jest.fn(() => 0);
  });

  afterAll(() => {
    console.error = originalConsoleError;
    global.Date.now = realDateNow;
  });

  beforeEach(() => {
    jest.spyOn(ChatStorageService, "addChat").mockReset();
    jest.spyOn(ChatStorageService, "getHistoryOfChat").mockReset();
    global.fetch.mockReset();
  });

  test("should process response and add chat to history", async () => {
    const email = "user@example.com";
    const message = "I feel sick";
    const mockData = { AI_out: "please be specific." };

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    await ChatService.processResponse({ email, message });

    expect(global.fetch).toHaveBeenCalledWith(
      `https://diagnobuddy.azurewebsites.net/api/langchainmodel/?user_input=${encodeURIComponent(
        message
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(ChatStorageService.addChat).toHaveBeenCalledWith(
      email,
      message,
      mockData.AI_out
    );
    expect(ChatStorageService.getHistoryOfChat).toHaveBeenCalledWith(email);
  });

  test("should throw an error if email is not provided", async () => {
    jest.spyOn(global, "fetch");

    try {
      await ChatService.processResponse({ email: "", message: "I am sick?" });
    } catch (error) {
      expect(error.message).toBe(emailNotSent);

      const actualErrorMessage = error.message;
      console.error("Actual error message:", actualErrorMessage);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(ChatStorageService.addChat).not.toHaveBeenCalled();
      expect(ChatStorageService.getHistoryOfChat).not.toHaveBeenCalled();
    }
  });

  test("should throw an error if message is empty", async () => {
    jest.spyOn(global, "fetch");

    try {
      await ChatService.processResponse({ email: "user@example.com", message: "" });
    } catch (error) {
      expect(error.message).toBe(emptyMessageErrorMessage);

      const actualErrorMessage = error.message;
      console.error("Actual error message:", actualErrorMessage);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(ChatStorageService.addChat).not.toHaveBeenCalled();
      expect(ChatStorageService.getHistoryOfChat).not.toHaveBeenCalled();
    }
  });

  test("should throw an error if the question is not a medical question", async () => {
    jest.spyOn(global, "fetch");

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({}),
    });

    try {
      await ChatService.processResponse({ email: "user@example.com", message: "2 plus 2" });
    } catch (error) {
      expect(error.message).toBe(
        "I'm sorry, but I'm unable to assist with that question. My role is to provide medical advice and information. If you have any health concerns or questions, please feel free to ask."
      );

      const actualErrorMessage = error.message;
      console.error("Actual error message:", actualErrorMessage);

      expect(global.fetch).toHaveBeenCalled();
      expect(ChatStorageService.addChat).not.toHaveBeenCalled();
      expect(ChatStorageService.getHistoryOfChat).not.toHaveBeenCalled();
    }    
  });

  test("should throw an error if fetch fails", async () => {
    jest.spyOn(global, "fetch");

    global.fetch.mockRejectedValueOnce(new Error("Simulated fetch failure"));

    try {
      await ChatService.processResponse({ email: "user@example.com", message: "Im sick?" });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

      expect(global.fetch).toHaveBeenCalled();
      expect(ChatStorageService.addChat).not.toHaveBeenCalled();
      expect(ChatStorageService.getHistoryOfChat).not.toHaveBeenCalled();
    }
  });

  test("should reset chat history if user is inactive for more than 30 minutes", async () => {
    const email = "user@example.com";
    const message = "I feel sick";
    const mockData = { AI_out: "Please give more details." };

    jest
      .spyOn(ChatStorageService, "resetChatHistory")
      .mockImplementation(jest.fn());

    UserSessionTracker.updateLastUserActivityTime(email);

    global.Date.now = jest.fn(() => 31 * 60 * 1000);

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    await ChatService.processResponse({ email, message });

    expect(ChatStorageService.resetChatHistory).toHaveBeenCalledWith(email);
    expect(ChatStorageService.getHistoryOfChat.length).toBe(0);
  });

});
