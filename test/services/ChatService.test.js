const ChatStorageService = require("../../src/services/ChatStorageService");
const SessionId = require("../../src/utils/SessionId");
const ChatService = require("../../src/services/ChatService");

const emailNotSent = "No email provided";
const emptyMessageErrorMessage =
  "I apologize for any confusion, but I'm unable to provide any assistance without a clear description of your symptoms or health concerns. If you're experiencing any specific symptoms or have any health-related questions, please let me know, and I'll do my best to help you.";

jest.spyOn(global, "fetch");

describe("ChatService TestCases", () => {
  const email = "user@example.com";
  const message = "I feel sick";
  const sessionId = "mockedSessionId";
  const mockData = { AI_out: "Please provide more details." };

  beforeEach(() => {
    jest.spyOn(ChatStorageService, "addChat").mockReset();
    jest.spyOn(ChatStorageService, "getHistoryOfChat").mockReset();
    jest.spyOn(SessionId, "cookieToken").mockResolvedValueOnce(sessionId);
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    global.fetch.mockClear();
  });

  test("should process response and add chat to history", async () => {
    const response = await ChatService.processResponse({
      email,
      message,
      sessionId,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `https://diagnobuddy.azurewebsites.net/api/gpmodel/?user_input=${encodeURIComponent(
        message
      )}&session_id=${sessionId}`,
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
      mockData.AI_out,
      sessionId
    );
    expect(ChatStorageService.getHistoryOfChat).toHaveBeenCalledWith(email);
    expect(response.data).toEqual(mockData);
    expect(response.sessionId).toEqual(sessionId);
  });

  test("should throw an error if email is not provided", async () => {
    try {
      await ChatService.processResponse({ email: "", message: "I am sick?" });
    } catch (error) {
      expect(error.message).toBe(emailNotSent);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(ChatStorageService.addChat).not.toHaveBeenCalled();
      expect(ChatStorageService.getHistoryOfChat).not.toHaveBeenCalled();
    }
  });

  test("should throw an error if message is empty", async () => {
    try {
      await ChatService.processResponse({
        email: "user@example.com",
        message: "",
      });
    } catch (error) {
      expect(error.message).toBe(emptyMessageErrorMessage);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(ChatStorageService.addChat).not.toHaveBeenCalled();
      expect(ChatStorageService.getHistoryOfChat).not.toHaveBeenCalled();
    }
  });

  test("should throw a generic error if fetch fails", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Simulated fetch failure"));

    try {
      await ChatService.processResponse({ email, message });
    } catch (error) {
      expect(error.message).toBe(
        "An error occurred while processing the request."
      );

      expect(global.fetch).toHaveBeenCalled();
      expect(ChatStorageService.addChat).not.toHaveBeenCalled();
      expect(ChatStorageService.getHistoryOfChat).not.toHaveBeenCalled();
    }
  });
  
  test("should assign a sessionId to the user after the first chat has been sent", async () => {
    jest.spyOn(SessionId, "cookieToken").mockResolvedValueOnce(null);

    const response = await ChatService.processResponse({ email, message });

    expect(SessionId.cookieToken).toHaveBeenCalled();
    expect(response.sessionId).not.toBeNull();
    expect(response.data).toEqual(mockData);
  });

  test("subsequent chats come in with the user's sessionId", async () => {
    const response = await ChatService.processResponse({
      email,
      message,
      sessionId,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `https://diagnobuddy.azurewebsites.net/api/gpmodel/?user_input=${encodeURIComponent(
        message
      )}&session_id=${sessionId}`,
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
      mockData.AI_out,
      sessionId
    );
    expect(ChatStorageService.getHistoryOfChat).toHaveBeenCalledWith(email);
    expect(response.data).toEqual(mockData);
    expect(response.sessionId).toEqual(sessionId);
  });

  test("should throw a generic error if fetch fails", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Simulated fetch failure"));

    try {
      await ChatService.processResponse({ email, message });
    } catch (error) {
      const errorMessage =
        error.message || "An error occurred while processing the request.";

      expect(errorMessage).toBe("Simulated fetch failure");

      expect(global.fetch).toHaveBeenCalled();
      expect(ChatStorageService.addChat).not.toHaveBeenCalled();
      expect(ChatStorageService.getHistoryOfChat).not.toHaveBeenCalled();
    }
  });

  
  test("should call SessionId.cookieToken if sessionId is not provided", async () => {
    SessionId.cookieToken.mockClear();

    const response = await ChatService.processResponse({
      email,
      message,
      sessionId: null,
    });

    expect(SessionId.cookieToken).toHaveBeenCalledWith(email, undefined);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://diagnobuddy.azurewebsites.net/api/gpmodel/?user_input=${encodeURIComponent(
        message
      )}&session_id=${sessionId}`,
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
      mockData.AI_out,
      sessionId
    );
    expect(ChatStorageService.getHistoryOfChat).toHaveBeenCalledWith(email);
    expect(response.data).toEqual(mockData);
    expect(response.sessionId).toEqual(sessionId);
  });
});
