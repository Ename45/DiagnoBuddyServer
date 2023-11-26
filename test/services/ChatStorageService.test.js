const ChatStorageService = require("../../src/services/ChatStorageService");

describe("ChatStorage TestCases", () => {  

  describe("addChat", () => {
    test("should add chat entry for a new user", () => {
      ChatStorageService.addChat(
        "user1@example.com",
        "I feel sick",
        "Please be specific",
        "sessionId1"
      );
      const userChatHistory = ChatStorageService.getHistoryOfChat("user1@example.com");
      expect(userChatHistory.length).toBe(1);
      expect(userChatHistory[0].message).toBe("I feel sick");
      expect(userChatHistory[0].response).toBe("Please be specific");
      expect(userChatHistory[0].sessionId).toBe("sessionId1");
    });

    test("should add chat entry for an existing user", () => {
      ChatStorageService.addChat(
        "user2@example.com",
        "I feel sick",
        "Please be specific",
        "sessionId2"
      );
      ChatStorageService.addChat(
        "user2@example.com",
        "having headaches",
        "Sorry to hear that, drink panadol",
        "sessionId2"
      );
      const userChatHistory =
        ChatStorageService.getHistoryOfChat("user2@example.com");
      expect(userChatHistory.length).toBe(2);
      expect(userChatHistory[0].message).toBe("I feel sick");
      expect(userChatHistory[0].response).toBe(
        "Please be specific"
      );
      expect(userChatHistory[0].sessionId).toBe("sessionId2");
      expect(userChatHistory[1].message).toBe("having headaches");
      expect(userChatHistory[1].response).toBe(
        "Sorry to hear that, drink panadol",
        "sessionId2"
      );
    });

    test("should throw error if sessionId is not provided", () => {
      expect(() =>
        ChatStorageService.addChat(
          "user3@example.com",
          "I feel sick",
          "I apologize, I need your session ID to assist you.",
          null
        )
      ).toThrowError("unauthorized request");
    });
  });

  describe("getHistoryOfChat", () => {
    test("should return empty array for a new user", () => {
      const userChatHistory = ChatStorageService.getHistoryOfChat(
        "newUser@example.com"
      );
      expect(userChatHistory.length).toBe(0);
    });

    test("should return chat history for an existing user", () => {
      ChatStorageService.addChat(
        "existingUser@example.com",
        "Hi, im sick",
        "Please be specific",
        "sessionId3"
      );
      ChatStorageService.addChat(
        "existingUser@example.com",
        "feel dizzy",
        "you need to rest",
        "sessionId3"
      );
      const userChatHistory = ChatStorageService.getHistoryOfChat(
        "existingUser@example.com"
      );
      expect(userChatHistory.length).toBe(2);
      expect(userChatHistory[0].message).toBe("Hi, im sick");
      expect(userChatHistory[0].response).toBe("Please be specific");
      expect(userChatHistory[0].sessionId).toBe("sessionId3");
      expect(userChatHistory[1].message).toBe("feel dizzy");
      expect(userChatHistory[1].response).toBe(
        "you need to rest",
        "sessionId3"
      );
    });
  });

  describe("resetChatHistory", () => {
    test("should clear chat history for an existing user", () => {
      ChatStorageService.addChat(
        "user4@example.com",
        "Good morning",
        "Good morning to you too!",
        "sessionId4"
      );
      ChatStorageService.addChat(
        "user4@example.com",
        "What's the news today?",
        "There's nothing major going on today.",
        "sessionId4"
      );
      ChatStorageService.resetChatHistory("user4@example.com");
      const userChatHistory =
        ChatStorageService.getHistoryOfChat("user4@example.com");
      expect(userChatHistory.length).toBe(0);
    });

    test("should not affect chat history for other users", () => {
      ChatStorageService.addChat(
        "user5@example.com",
        "Hi there",
        "Hello!",
        "sessionId5"
      );
      ChatStorageService.resetChatHistory("user4@example.com");
      const user5ChatHistory =
        ChatStorageService.getHistoryOfChat("user5@example.com");
      expect(user5ChatHistory.length).toBe(1);
    });
  });
});
