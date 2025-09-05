const proces = require("process");
const donEnv = require("dotenv").config();
const parseEnv = donEnv?.parsed;

const envConfig = {
    mongoURI: parseEnv.MONGO_URI,
    port: parseEnv.PORT,
    mail_box_checker:parseEnv.MAILBOXLAYER_KEY,
}

module.exports = envConfig;