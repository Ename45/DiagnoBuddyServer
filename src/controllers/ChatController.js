const ChatService = require("../services/ChatService");

const processResponses = async (req, res) => {
  const userObject = req.body;
  try {
    const userResponse = await ChatService.processResponse(userObject, res);
    return res.json(userResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  processResponses,
};
