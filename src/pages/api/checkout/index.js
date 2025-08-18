import connectToDatabase from "../../../lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "../../../models/User";

async function checkout(req, res) {
  await connectToDatabase();
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} is not allowed!`);
    return;
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    res.status(403).json({ message: "No user logged in!" });
    return;
  }
  if (!user.cart) {
    res.status(403).json({ message: "Cart is empty!" });
    return;
  }
}

export default checkout;
