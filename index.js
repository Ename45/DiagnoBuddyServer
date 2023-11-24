const express = require("express");
const cors = require("cors");
const ChatRoutes = require("./src/routes/ChatRoutes")
const SendChatsToMailRoutes = require("./src/routes/SendChatsToMailRoutes")
require("dotenv").config()

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(
  cors({
    origin: "https://diagno-buddy.vercel.app",
    credentials: true,
  })
);


app.use("/api/v1/diagnoBuddy/chats", ChatRoutes);
app.use("/api/v1/diagnoBuddy/sendMail", SendChatsToMailRoutes);



app.listen(process.env.PORT, () => {
  console.log("server is running on this port", process.env.PORT)
});