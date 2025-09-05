const mongoose = require("mongoose");
const { mongoURI } = require("./configEnv");

const connectDB = async () => {
    console.log("mongoURI========", mongoURI)
    try {
        await mongoose.connect(`${mongoURI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // 5s
        });
        console.log("Connected ✅");
    }
    catch (err) {
        console.log("Connection failed ❌", err);
        throw new Error("Server is not Connting pls check")
    }
};
module.exports = connectDB