const SendChatsToMailService = require("../../src/services/SendChatsToMailService");
const ChatStorageService = require("../../src/services/ChatStorageService");
const SendEmail = require("../../src/utils/SendEmails");

jest.mock("../../src/utils/SendEmails");

describe("SendChatsToMailService TestCases", () => {
  beforeEach(() => {
    ChatStorageService.resetChatHistory("user@example.com");
    SendEmail.sendEmail.mockReset();
  });

  test("should send chat successfully", async () => {
    const email = "user@example.com";
    const message = "I feel sick";
    const response = "Please provide more details.";

    ChatStorageService.addChat(email, message, response);

    SendEmail.sendEmail.mockResolvedValueOnce();

    await expect(SendChatsToMailService.sendChat(email)).resolves.toBe(
      "Chat successfully sent, check mailbox"
    );
    expect(SendEmail.sendEmail).toHaveBeenCalled();
  });

  test("should throw an error if email is not provided", async () => {
    await expect(SendChatsToMailService.sendChat("")).rejects.toThrow(
      "email not provided"
    );
    expect(SendEmail.sendEmail).not.toHaveBeenCalled();
  });

  test("should throw an error if there is no chat history", async () => {
    await expect(
      SendChatsToMailService.sendChat("user@example.com")
    ).rejects.toThrow("No chat to send");
    // Ensure that SendEmail.sendEmail is not called
    expect(SendEmail.sendEmail).not.toHaveBeenCalled();
  });

  test("should throw an error if there is a problem sending email", async () => {
    const email = "user@example.com";
    const message = "I feel sick";
    const response = "Please provide more details.";

    ChatStorageService.addChat(email, message, response);

    SendEmail.sendEmail.mockRejectedValueOnce(
      new Error("Failed to send email")
    );

    await expect(SendChatsToMailService.sendChat(email)).rejects.toThrow(
      "Failed to send email"
    );
    expect(SendEmail.sendEmail).toHaveBeenCalled();
  });

  test("should reset chat history after sending email", async () => {
    const email = "user@example.com";
    const message = "I feel sick";
    const response = "Please provide more details.";

    ChatStorageService.addChat(email, message, response);

    SendEmail.sendEmail.mockResolvedValueOnce();

    await expect(SendChatsToMailService.sendChat(email)).resolves.toBeTruthy();

    const history = ChatStorageService.getHistoryOfChat(email);
    expect(history).toHaveLength(0);
  });

  
});
