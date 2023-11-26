const SessionHelper = require("../helpers/SessionHelper");
const ChatStorageService = require("../services/ChatStorageService");

const generateId = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

const SESSION_EXPIRATION_TIME = 5 * 60  * 1000; 

let sessionTimer;

const resetSessionTimer = (email) => {
  clearTimeout(sessionTimer);

  sessionTimer = setTimeout(() => {
    ChatStorageService.resetChatHistory(email);
  }, SESSION_EXPIRATION_TIME);
};

const cookieToken = async (email, res) => {
  const existingUserSessionId = await SessionHelper.getExistingUserSessionId(
    email
  );

  if (existingUserSessionId) {
    resetSessionTimer(email);
    return existingUserSessionId;
  } else {
    const newSessionId = await generateId();

    const options = {
      expires: new Date(Date.now() + SESSION_EXPIRATION_TIME),
      httpOnly: true,
      secure: true,
    };

    res.status(200).cookie("sessionId", newSessionId, options);

    resetSessionTimer(email);

    return newSessionId;
  }
};

module.exports = {
  cookieToken,
};
