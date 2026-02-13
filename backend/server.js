require("dotenv").config();
const express = require("express");
const twilio = require("twilio");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
app.use(cors());
// Send SMS API
app.post("/send-sms", async (req, res) => {
  console.log("api hit");
  const { to, message } = req.body;

  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });

    res.json({
      success: true,
      sid: response.sid
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});




//new endpoint


app.post("/send-sms2", async (req, res) => {
  console.log("API HIT");

  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({
      success: false,
      error: "Phone number and message are required"
    });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  try {
    console.log(to);
    console.log(fromNumber)
    console.log(message);
    const response = await axios.post(
      url,
      new URLSearchParams({
        To: to,
        From: fromNumber,
        Body: message
      }).toString(),
      {
        auth: {
          username: accountSid,
          password: authToken
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    res.json({
      success: true,
      sid: response.data.sid
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
