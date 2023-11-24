const { processResponse } = require("../../src/services/ChatService");
const ChatStorageService = require("../../src/services/ChatStorageService");

jest.spyOn(global, "fetch");

const emailNotSent = "No email provided";
const emptyMessageErrorMessage =
  "I apologize for any confusion, but I'm unable to provide any assistance without a clear description of your symptoms or health concerns. If you're experiencing any specific symptoms or have any health-related questions, please let me know, and I'll do my best to help you.";

describe("ChatService TestCases", () => {
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.spyOn(ChatStorageService, "addChat").mockReset();
    jest.spyOn(ChatStorageService, "getHistoryOfChat").mockReset();
    global.fetch.mockReset();
  });

  test("should process response and add chat to history", async () => {
    const email = "user@example.com";
    const message = "How are you?";
    const mockData = { AI_out: "I am fine." };

    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    await processResponse({ email, message });

    expect(global.fetch).toHaveBeenCalledWith(
      `https://diagnobuddy.azurewebsites.net/api/gpmodel/?user_input=${encodeURIComponent(
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
      await processResponse({ email: "", message: "I am sick?" });
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
      await processResponse({ email: "user@example.com", message: "" });
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
      await processResponse({ email: "user@example.com", message: "2 plus 2" });
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
      await processResponse({ email: "user@example.com", message: "Im sick?" });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);

      expect(global.fetch).toHaveBeenCalled();
      expect(ChatStorageService.addChat).not.toHaveBeenCalled();
      expect(ChatStorageService.getHistoryOfChat).not.toHaveBeenCalled();
    }
  });

});
