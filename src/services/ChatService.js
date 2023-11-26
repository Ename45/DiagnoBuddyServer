const ChatStorageService = require("./ChatStorageService");
const SessionId = require("../../src/utils/SessionId")

const emptyMessageErrorMessage =
  "I apologize for any confusion, but I'm unable to provide any assistance without a clear description of your symptoms or health concerns. If you're experiencing any specific symptoms or have any health-related questions, please let me know, and I'll do my best to help you.";
const emailNotSent = "No email provided";

const processResponse = async ({ email, message, sessionId }, res) => {

  checkIfNull(email, message);

  if (!sessionId) {
    sessionId = await SessionId.cookieToken(email, res);
  }

  const apiUrl = `https://diagnobuddy.azurewebsites.net/api/gpmodel/?user_input=${encodeURIComponent(
    message
  )}&session_id=${sessionId}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const aiResponse = data.AI_out;
    // console.log("newData==============>", aiResponse);
    await ChatStorageService.addChat(email, message, aiResponse, sessionId);

    await ChatStorageService.getHistoryOfChat(email);
    return {
      data,
      sessionId,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  processResponse,
};




function checkIfNull(email, message) {
  if (!email) {
    throw new Error(emailNotSent);
  }

  if (message === "") {
    throw new Error(emptyMessageErrorMessage);
  }
}
