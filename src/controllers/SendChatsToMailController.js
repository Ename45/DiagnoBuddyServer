const SendChatsToMailService = require("../services/SendChatsToMailService");

const sendChat = async (req, res) => {
  const {email} = req.body;
  try {
    const sentMessage = await SendChatsToMailService.sendChat(email);
    return res.json(sentMessage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendChat,
};
