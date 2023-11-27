                          {DIAGNOBUDDY SERVER}
The DiagnoBuddy Server is a backend service that leverages an openAi API for managing user medical related inputs and giving appropriate responses. Our server provides functionality for managing user chats and sending chat histories via email.
{Usage}
To use the DiagnoBuddy Server run the command: npm start




                          {index.js COMPONENT}
{INITIAL ROUTES}
1) *Chat Routes* 
(POST /api/v1/diagnoBuddy/chats): 
Endpoint for processing user messages and generating AI responses.

2) *SendChatsToMail Routes*
(POST /api/v1/diagnoBuddy/sendMail):
Endpoint for sending user chat histories to their email addresses.


{Environment Variables}
The DiagnoBuddy Server uses environment variables for configuration. The .env file in the root directory has the following variables:

*PORT:* The port on which the server will run.
*AUTH_EMAIL:* The email address used as the sender when sending chat histories via email.
*AUTH_PASSWORD:* The password to the email address.





                          {ROUTES FOLDER}
1) ChatRoutes COMPONENT
*POST (/api/v1/diagnoBuddy/chats)*:
This endpoint processes user messages, generates AI responses, and stores the chat history.

This route is handled by the ChatController.processResponses function

2) SendChatsToMailRoutes COMPONENT
*POST (/api/v1/diagnoBuddy/sendMail)*:
This module defines the API route related to sending chat history to user email.

This route is handled by the SendChatsToMailController.sendChat function.





                          {CONTROLLERS FOLDER}
1) {ChatController COMPONENT}
The ChatController is responsible for handling incoming requests related to user responses and coordinating with the ChatService to process and respond to these requests.

*Body (req):* JSON object containing user response details.
{
  "email": "user@example.com",
  "message": "User's message",
  "sessionId": "user-session-id (sent as a cookie containing the sessionId)"
}

The controller calls the *ChatService.processResponse(userObject, res)*


*Success Response:* 200 OK with a success message.
{
  "data": {
    "AI_out": "DiagnoBuddy's ai response"
  },
  "sessionId": "12345"
}


2) {SendChatsToMailController COMPONENT}
The SendChatsToMailController is responsible for handling incoming requests related to sending user chats to email and coordinating with the SendChatsToMailService to process and respond to these requests.

*Body (req):* JSON object containing the user's email.
{
  "email": "user@example.com"
}

The controller calls the *SendChatsToMailService.sendChat(email)*

*Success Response:* 200 OK with a success message.
{
  "message": "Chat successfully sent, check mailbox"
}





                          {SERVICES FOLDER}
1) {ChatService COMPONENT}
The ChatService component provides functionality to process user messages, interact with a diagnostic model API, and manage chat history using the ChatStorageService and SessionId utilities.

{Functions}
*processResponse({ email, message, sessionId }, res):* Processes the user's message, interacts with the diagnostic model API, and manages chat history.

{Parameters:}
*email:* User's email address.
*message:* User's message.
*sessionId:* Session ID associated with the user.This is not needed with the first message the user sends. But the response sent back will be accompanied with a sessionId to be stored as a cookie in the web browser and subsequent request made by the user in that session has to be accompanied by a sessionId
*res:* Express.js response object.

{Returns:}
An object containing the API response (data) and the session ID.

{Error Handling}
The ChatService component handles errors related to missing email and empty messages. If an error occurs during the API request, it is thrown for the calling code to handle.


2) {ChatStorageService COMPONENT}
The ChatStorageService component provides a simple in-memory chat storage solution. It allows to add chat messages, retrieve chat history, and reset chat history for a given user.

{Functions}
*createChatStorage()*: Creates a new instance of the chat storage.

{Returns:}
An object with the following functions:
*addChat(email, message, response, sessionId):* Adds a new chat message.
*getHistoryOfChat(email):* Retrieves the chat history for a user.
*resetChatHistory(email):* Resets the chat history for a user.

{Error Handling}
The ChatStorageService component throws an "unauthorized request" error if an attempt is made to add a chat message without a valid session ID.


3) {SendChatsToMailService COMPONENT}
The SendChatsToMailService component facilitates the sending of chat histories to user email addresses. It relies on the ChatStorageService to retrieve chat histories and the SendEmails utility to send emails.
{Functions}
*sendChat(email):* Sends the chat history of a user to their specified email address.

{Parameters:}
*email:* The email address to which the chat history will be sent.

{Returns:}
A success message if the chat history is sent successfully.

{Error Handling}
The SendChatsToMailService component throws errors in the following scenarios:
1) If no email address is provided.
2) If there is no chat history to send.
3) If there is a problem sending the chat history via email.





                            {HELPERS FOLDER}
{SessionHelper COMPONENT}
This module defines a helper function responsible for retrieving the existing user session ID based on their email. The SessionHelper module provides a function, getExistingUserSessionId, designed to retrieve the existing user session ID from the chat history stored in the ChatStorageService.

{Function:}
*getExistingUserSessionId(email)*: This function takes an email as a parameter and returns the existing session ID for the user. If no session ID is found, it returns null.





                             {UTILS FOLDER}
1) {SendEmails COMPONENT}
The SendEmail module contains functions to configure and use Nodemailer for sending emails.

2) {SessionId COMPONENT}
The SessionId module provides functionality for creating and managing user session. It relies on the SessionHelper and ChatStorageService modules.

{Functions:}
*generateId():* This function generates a random session ID by converting a random number to a string.
*resetSessionTimer(email):* This function resets the session timer for a given email by clearing the existing timer and setting a new one. It calls ChatStorageService.resetChatHistory(email) after the specified expiration time.
*cookieToken(email, res):* This asynchronous function checks if an existing session ID exists for the given email. If found, it returns the existing session ID. If not found, it generates a new session ID, sets the appropriate cookie options, and returns the new session ID.





                            {TEST FOLDER}
*To run the tests locally, use the command:* 
npm test

1) *utils:* This folder contains utility tests. Utilities are functions or modules that provide common functionality used across different parts of the application. The tests here verify that these utility functions work as expected.

2) *services:* Service tests are located in this folder. Services represent the core business logic of the application. Each service has its own set of tests to validate its functionality.

3) *helpers:* Tests here ensure that helper functions perform as intended.