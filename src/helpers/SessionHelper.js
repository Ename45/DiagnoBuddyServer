const ChatStorageService = require("../../src/services/ChatStorageService")


const getExistingUserSessionId = (email) => {
  const userChatInfo = ChatStorageService.getHistoryOfChat(email);

  if (userChatInfo && userChatInfo.length > 0) {
    return userChatInfo[userChatInfo.length - 1].sessionId;
  }

  return null;
};

module.exports = {
  getExistingUserSessionId,
};
