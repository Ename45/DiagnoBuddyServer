const createChatStorage = () => {
  const chatStorage = new Map();

  const addChat = (email, message, response) => {
    if (!chatStorage.has(email)) {
      chatStorage.set(email, []);
    }

    chatStorage.get(email).push({ message, response });
  };



  const getHistoryOfChat = (email) => {
    return chatStorage.get(email) || [];
  };


  return {
    addChat,
    getHistoryOfChat,
  };
};



module.exports = createChatStorage();
