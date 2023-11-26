const SendChatsToMailService = require("../../src/services/SendChatsToMailService");
const ChatStorageService = require("../../src/services/ChatStorageService");
const SendEmail = require("../../src/utils/SendEmails");

const mockSendEmail = jest.spyOn(SendEmail, "sendEmail");

jest.mock("../../src/services/ChatStorageService", () => ({
  getHistoryOfChat: jest.fn(),
  resetChatHistory: jest.fn(),
}));

const mockChatHistory = [
  { message: "Hi", response: "How can i assist" },
  {
    message: "I feel sick",
    response: "Please be specific",
  },
];

function formatResponse(response) {
  return response.replace(/\n/g, "<br>");
}

describe("SendChatsToMailService TestCases", () => {
  test("should throw error if email is not provided", async () => {
    try {
      await SendChatsToMailService.sendChat();
    } catch (error) {
      expect(error.message).toBe("email not provided");
    }
  });

  test("should throw error if user has no chat history", async () => {
    jest.spyOn(ChatStorageService, "getHistoryOfChat").mockReturnValueOnce([]);

    try {
      await SendChatsToMailService.sendChat("some@example.com");
    } catch (error) {
      expect(error.message).toBe("No chat to send");
    }
  });

  test("should successfully send chat to email", async () => {
    const mockChatHistory = [
      { message: "Hi", response: "Hello there!" },
      {
        message: "How are you?",
        response: "I'm doing well, thanks for asking.",
      },
    ];
    jest
      .spyOn(ChatStorageService, "getHistoryOfChat")
      .mockReturnValueOnce(mockChatHistory);

    const chatMessage = await SendChatsToMailService.sendChat(
      "test@example.com"
    );
    expect(chatMessage).toBe("Chat successfully sent, check mailbox");
    expect(ChatStorageService.getHistoryOfChat).toHaveBeenCalledWith(
      "test@example.com"
    );
    expect(ChatStorageService.resetChatHistory).toHaveBeenCalledWith(
      "test@example.com"
    );
  });

test("should handle errors sending emails", async () => {
  jest
    .spyOn(ChatStorageService, "getHistoryOfChat")
    .mockReturnValueOnce(mockChatHistory);
  mockSendEmail.mockImplementationOnce(() => {
    throw new Error("Failed to send email");
  });

  try {
    await SendChatsToMailService.sendChat("test@example.com");
  } catch (error) {
    expect(error.message).toBe("Failed to send email");
  }
});


  test("should format chat responses correctly", () => {
    
    const formattedResponse = formatResponse(
      "Hello there.\nHow can I help you?"
    );
    expect(formattedResponse).toBe("Hello there.<br>How can I help you?");
  });
});
