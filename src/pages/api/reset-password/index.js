import connectToDatabase from "../../../lib/mongoose";
import User from "../../../models/User";
import crypto from "crypto";
import bcrypt from "bcrypt";
import sendPasswordChangeEmail from "../../../lib/emails/resetPassword";

export default async function handler(req, res) {
  await connectToDatabase();
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed.`);
  }
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Missing token or invalid password." });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    await sendPasswordChangeEmail(user.email, user.username);
    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
}
