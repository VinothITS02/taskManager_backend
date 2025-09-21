
const express = require("express");
const connectDB = require("./database");
const cookie = require("cookie-parser");
//router
const authRouter = require("./router/authRouter");

const PORT = process.env.PORT || 3000;

// Middleware
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookie());

// Routes
app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

app.use("/", authRouter);

// Start Server
connectDB().then(() => {
    console.log("DB connected Successfully!!")
    app.listen(PORT, () => {
        console.log(`Server is running successfuly listing on port:${PORT} 🚀🎈🎉`)
    });
})
    .catch((err) => {
        console.log("DB not connected. Please try again")
    })
