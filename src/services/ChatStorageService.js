// ChatStorageService.js

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



  const deleteChats = (email) => {
    if (chatStorage.has(email)) {
      chatStorage.delete(email);
    } else {
      return `No chat history for ${email}`;
    }
  };



  return {
    addChat,
    getHistoryOfChat,
    deleteChats,
  };
};



module.exports = createChatStorage();
