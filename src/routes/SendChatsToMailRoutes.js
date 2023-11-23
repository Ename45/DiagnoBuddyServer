const express = require("express");
const router = express.Router();
const SendChatsToMailController = require("../controllers/SendChatsToMailController")


router.post("/", SendChatsToMailController.sendChat)


module.exports = router