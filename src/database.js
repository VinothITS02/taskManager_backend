const mongoose = require("mongoose");
const { mongoURI } = require("./configEnv");

const connectDB = async () => {
    console.log("mongoURI========", mongoURI)
    try {
        await mongoose.connect(`${mongoURI}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    catch (err) {
        console.log("err", err);
        throw new Error("Server is not Connting pls check")
    }
};
module.exports = connectDB