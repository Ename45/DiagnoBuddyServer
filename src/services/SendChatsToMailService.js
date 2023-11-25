const ChatStorageService = require("./ChatStorageService");
const SendEmail = require("../utils/SendEmails");
require("dotenv").config();


const emailNotProvided = "email not provided";
const noChatHistory = "No chat to send";
const chatSuccessfullySentToEmail = "Chat successfully sent, check mailbox";



const sendChat = async (email) => {
  if (!email) {
    throw new Error(emailNotProvided);
  }

  const userChatHistory = await ChatStorageService.getHistoryOfChat(email);

  if (!userChatHistory.length) {
    throw new Error(noChatHistory);
  }

  const chatMessage = await sendUserChat(email, userChatHistory);

  ChatStorageService.resetChatHistory(email)

  return chatMessage;
};

module.exports = {
  sendChat,
};



async function sendUserChat(email, userChatHistory) {
  const formattedChats = userChatHistory.map((chat, index) => {
    return `<p><strong>You ${index + 1}:</strong> ${chat.message}</p>
            <p><strong>DiagnoBuddy ${index + 1}:</strong> ${JSON.stringify(
      chat.response
    )}</p>`;

  });

  const mailDetails = {
    email,
    subject: "DiagnoBuddy Chats",
    message: formattedChats.join("<br>")
  };

  try {
    const mailMessage = await requestEmail(mailDetails, userChatHistory);
    return mailMessage;
  } catch (error) {
    throw error;
  }
}


const requestEmail = async (request, userChatHistory) => {
  const { email, subject, message } = request;

  if (!(email && message && subject)) {
    throw new Error("Email, subject, and message are required");
  }

  const mailDetails = {
    email,
    subject,
    message,
    userChatHistory
  };

  try {
    const sentChat = await sendChatToMail(mailDetails);

    if (!sentChat) {
      throw new Error("problem sending chat");
    }

    return sentChat;
  } catch (error) {
    throw error;
  }
};



const sendChatToMail = async (emailDetails) => {
  try {
    const { email, subject, message } = emailDetails;

    await sendEmailWithChats(email, subject, message);

    return chatSuccessfullySentToEmail;
  } catch (error) {
    throw new Error(error.message);
  }
};

async function sendEmailWithChats(email, subject, message) {
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject,
    html: `<p>${message}</p>`,
  };

  try {
    await SendEmail.sendEmail(mailOptions);
  } catch (error) {
    throw error;
  }
}
