require("dotenv").config();

const envConfig = {
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT || 5000,
    mail_box_checker: process.env.MAILBOXLAYER_KEY,
};

module.exports = envConfig;