const createChatStorage = () => {
  const chatStorage = new Map();

  const addChat = (email, message, response, sessionId) => {
    if (!sessionId) {
      throw new Error("unauthorized request")
    }
    if (!chatStorage.has(email)) {
      chatStorage.set(email, []);
    }
    chatStorage.get(email).push({ message, response, sessionId });
  };

  const getHistoryOfChat = (email) => {
    const userChatInfo = chatStorage.get(email) || [];
    return userChatInfo;
  };

  const resetChatHistory = (email) => {
    if (chatStorage.has(email)) {
      chatStorage.set(email, []);
    }
  };

  return {
    addChat,
    getHistoryOfChat,
    resetChatHistory,
  };
};

module.exports = createChatStorage();
