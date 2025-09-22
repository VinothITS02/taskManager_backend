const express = require("express");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const expiresIn = '1h';
const { mail_box_checker } = require("../configEnv")

const fetch = require("node-fetch");


authRouter.post("/signup", async (req, res) => {
    try {
        console.log("-------signup service stating -----")
        let { password, emailId, userName } = req.body;
        //Check email is validate or not 
        console.log("==========>befor calling validation email=============>")

        let checkEmail = await validatonEmail(emailId);
        console.log("==========>after calling validation email=============>", checkEmail)
        if (!checkEmail?.smtp_check) return res.json({ message: "Please provide validate email address", success: false, data: null });

        //Checking if username aleredy exist
        let existing = await User.find({ $or: [{ emailId: emailId.toLowerCase() }, { userName }], });
        if (existing) {
            return res.status(409).json({ message: "Email or username already in use", success: false });
        }
        let passwordBcrypt = await bcrypt.hash(password, 10);
        req.body.password = passwordBcrypt;
        let user = new User(req.body);
        await user.save();
        res.json({
            message: "Data Saved Successfuly to signup collection",
            data: user
        })
    }
    catch (err) {
        console.log("-------signup service error part -----")
        res.json({
            message: err.message,
            success: false
        })
    }
});

authRouter.post("/login", async (req, res) => {
    console.log("-------login functionality starting -----")
    try {
        let { emailId, password } = req.body;
        let findUser = await User.findOne({ emailId });
        if (!findUser) {
            res.status(400).json({
                message: "Invalid Credentials!!!",
                success: false
            })
            return;
        }
        let passowrdCheck = await findUser.validatePassword(password);
        if (!passowrdCheck) {
            res.status(400).json({
                message: "Invalid Credentials!!!",
                success: false
            })
            return;
        }
        let jwtToken = await jwt.sign({ _id: findUser._id }, process.env.JWT_TOKEN_PASSWORD, { expiresIn });
        res.cookie("token", jwtToken);
        res.status(400).json({
            message: "Logged in successfully!",
            success: true,
            data: findUser
        })
        console.log("Ending the login function with successfully connected=========>")
    }
    catch (err) {
        console.log("-------login service error part -----", err)
        res.status(400).json({
            message: err?.message || "Something went wrong!. Unable to procced your request",
            success: false
        })
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expiresIn: new Date(Date.now)
    });
    res.send("Logout successfuly")
});

authRouter.post("/validate-email", async (req, res) => {
    const { email } = req.body;
    const url = `http://apilayer.net/api/check?access_key=${mail_box_checker}&email=${email}&smtp=1&format=1`;

    try {
        const resp = await fetch(url);
        const data = await resp.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const validatonEmail = async (email) => {
    const url = `http://apilayer.net/api/check?access_key=${mail_box_checker}&email=${email}&smtp=1&format=1`;
    console.log("//////////// email validation URL=>>>>>>>>>", url)
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        console.log("====Email Validation Response Data====", data)
        return data;
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = authRouter;