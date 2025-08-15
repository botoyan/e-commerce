import connectToDatabase from "../../../lib/mongoose";
import User from "../../../models/User";
import { sendWelcomeEmail } from "../../../lib/emails/welcome";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed.`);
  }

  try {
    const email = req.body.email?.trim().toLowerCase();
    const username = req.body.username?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      userType: "user",
    });

    await newUser.save();

    await sendWelcomeEmail(email, username);

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
