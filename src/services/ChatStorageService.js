const createChatStorage = () => {
  const chatStorage = new Map();

  const addChat = (email, message, response) => {
    if (!chatStorage.has(email)) {
      chatStorage.set(email, []);
    }
    chatStorage.get(email).push({ message, response });
  };

  const getHistoryOfChat = (email) => {
    chatStorage.forEach((message, response) => {
      console.log(message, response)
    });
    return chatStorage.get(email) || [];
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
