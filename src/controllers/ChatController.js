const ChatService = require("../services/ChatService");

const processResponses = async (req, res) => {
  const userObject = req.body;
  // console.log("User Object in controller======>", userObject);
  try {
    const userResponse = await ChatService.processResponse(userObject, res);
    // console.log("in controllers the userResponse===================>{}", userResponse)
    return res.json(userResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  processResponses,
};
