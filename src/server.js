// server.js
require('dotenv').config(); // <<-- load .env at the very top
const express = require("express");
const connectDB = require("./database");
const cookie = require("cookie-parser");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const { brevo_api_key } = require("./configEnv")

// router
const authRouter = require("./router/authRouter");
const otpRouter = require("./router/otpRouter");
const taskRouter = require("./router/taskRouter");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookie());

app.get("/", (req, res) => res.send("API is running 🚀"));

// Basic check that key is present
console.log("BREVO_API_KEY present?", !!brevo_api_key);

// configure Brevo client (do this once, after dotenv)
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = brevo_api_key;

// mount routes
app.use("/", authRouter);
app.use("/otp", otpRouter);
app.use("/task", taskRouter);

// Start Server after DB connect
connectDB()
  .then(() => {
    console.log("DB connected Successfully!!");
    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("DB not connected. Please try again", err);
  });
