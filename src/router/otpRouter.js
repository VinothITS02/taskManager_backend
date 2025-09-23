const express = require("express");
const otpRouter = express.Router();
const SibApiV3Sdk = require("sib-api-v3-sdk");
const { otp_sender_email } = require("../configEnv")

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// Temporary in-memory store { email: { otp, expiresAt } }
const otpStore = {};

// Helper: send OTP email
async function sendOtpEmail(toEmail, otp) {
  const sendSmtpEmail = {
    sender: { email: otp_sender_email, name: "Task Manager" },
    to: [{ email: toEmail }],
    subject: "Your Task Manager OTP Code",
    textContent: `Dear Subscriber,\n\nYour One-Time Password (OTP) is:\n\n${otp}\n\nThis OTP is valid for 10 minutes and can only be used once.\n\nSecurity Reminder: Never share your OTP with anyone. We will never ask for it via phone, email, or chat.\n\nIf you didn’t request this OTP, please contact our support team immediately at support@start.ca.\n\nThank you,\nThe Task Manager Team\nsupport@start.ca`,
    htmlContent: `<!doctype html><html><body style="font-family: Arial, Helvetica, sans-serif; color:#222;">
      <p>Dear Subscriber,</p>
      <p style="font-size:18px; margin:18px 0;">Your One-Time Password (OTP) is:</p>
      <p style="font-size:28px; font-weight:700; margin:8px 0; background:#f5f5f5; display:inline-block; padding:12px 18px; border-radius:6px;">${otp}</p>
      <p style="margin-top:18px;">This OTP is valid for <strong>10 minutes</strong> and can only be used once.</p>
      <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />
      <p style="color:#777; font-size:13px;"><strong>Security Reminder:</strong> Never share your OTP with anyone. We will never ask for it via phone, email, or chat.</p>
      <p style="color:#777; font-size:13px;">If you didn’t request this OTP, please contact our support team immediately at <a href="mailto:support@start.ca">support@start.ca</a>.</p>
      <p style="margin-top:18px;">Thank you,<br/><strong>The Task Manager Team</strong><br/><a href="mailto:support@start.ca">support@start.ca</a></p>
    </body></html>`,
  };

  return tranEmailApi.sendTransacEmail(sendSmtpEmail);
}

// Send OTP endpoint
otpRouter.post("/sendOTP", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save to store
    otpStore[email] = { otp, expiresAt };

    await sendOtpEmail(email, otp);

    return res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP endpoint
otpRouter.post("/verifyOTP", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ error: "No OTP requested for this email" });

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ error: "OTP expired" });
  }

  if (record.otp.toString() !== otp.toString()) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // OTP valid 🎉
  delete otpStore[email]; // one-time use
  return res.status(200).json({ success: true, message: "OTP verified successfully" });
});

module.exports = otpRouter;
