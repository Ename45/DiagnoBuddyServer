const express = require("express");
const router = express.Router()
const ChatController = require("../controllers/ChatController")


router.post("/", ChatController.processResponses)



module.exports = router