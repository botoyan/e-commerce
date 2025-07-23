import connectToDatabase from "../../../lib/mongoose";
import User from "../../../models/User";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../../../lib/emails/resetLink";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed.`);
  }

  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Missing field" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User Not Found." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    existingUser.resetPasswordToken = hashedToken;
    existingUser.resetPasswordExpires = Date.now() + 3600000;
    await existingUser.save();

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await sendResetPasswordEmail(email, existingUser.username, resetLink);

    return res.status(200).json({ message: "Reset email sent." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}
