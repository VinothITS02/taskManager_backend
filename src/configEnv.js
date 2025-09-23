require("dotenv").config();

const envConfig = {
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT || 5000,
    mail_box_checker: process.env.MAILBOXLAYER_KEY,
    brevo_api_key: process.env.BREVO_API_KEY,
    otp_sender_email: process.env.BREVO_SENDER_EMAIL
};

module.exports = envConfig;