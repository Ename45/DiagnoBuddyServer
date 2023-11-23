const ChatService = require("../services/ChatService");

const processResponses = async (req, res) => {
  const userQuestion = req.body;
  try {
    const userResponse = await ChatService.processResponse(userQuestion);
    // console.log("controller===>", userResponse);
    // const aiResponse = userResponse.newData
    // const email = userResponse.email
    return res.json(userResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  processResponses,
};
