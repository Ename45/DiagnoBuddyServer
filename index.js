const express = require("express");
const cors = require("cors");
const ChatRoutes = require("./src/routes/ChatRoutes")
const SendChatsToMailRoutes = require("./src/routes/SendChatsToMailRoutes")
require("dotenv").config()

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({
  origin: "",
  credentials: true
}));


app.get("/", (req, res) => {
  res.send("Hi its me")
})


app.use("/api/v1/diagnoBuddy/chats", ChatRoutes);
app.use("/api/v1/diagnoBuddy/sendMail", SendChatsToMailRoutes);


// app.post("/ask", async (req, res) => {
//   const userReq = req.body.msg

//   console.log(userReq)

//   if (userReq !== "") {
//     // const errorDetails = [
//     //   { loc: ["string", 0], msg: `User input: ${userReq}`, type: "string" },
//     // ];

//     try {
//       const apiUrl = `https://diagnobuddy.azurewebsites.net/api/gpmodel/?user_input=${encodeURIComponent(
//         userReq
//       )}`;

//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // body: JSON.stringify({ detail: errorDetails }),
//       });

//       const data = await response.json();
//       res.json(data);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
//   else {
//     return res.send("oops!! please input something, so i can advise accordingly")
//   }

  
// });



// app.post("/ask/:userQuery", async (req, res) => {
//   // const userReq = "please what do i do i fell and i have an injury in my eyes"
//   const userQuery = req.params.userQuery || "default-query";

//   const errorDetails = [
//     { loc: ["string", 0], msg: `User input: ${userQuery}`, type: "string" },
//   ];

//   try {
//     const apiUrl = `https://diagnobuddy.azurewebsites.net/api/gpmodel/?user_input=${encodeURIComponent(
//       userQuery
//     )}`;

//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // accept: "application/json",
//       },
//       body: JSON.stringify({ detail: errorDetails }),
//     });

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });


app.listen(process.env.PORT, () => {
  console.log("server is running on this port", process.env.PORT)
});