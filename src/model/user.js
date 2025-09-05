const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    emailId: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Please provide your password"]
    },
    phoneNumber: {
        type: String
    },
    photoURL: {
        type: String,
        default: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
    },
}, {
    timestamps: true
});
const User = mongoose.model("User", userSchema);
module.exports = User