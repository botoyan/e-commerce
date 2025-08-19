import connectToDatabase from "../../../lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "../../../models/User";
import Checkout from "../../../models/Checkout";

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
  const { cartItems } = req.body;
  if (!cartItems || cartItems.length === 0) {
    res.status(403).json({ message: "Missing cart items for the request!" });
    return;
  }

  const rawItems = cartItems?.products.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
  }));

  const calculatedTotal = cartItems?.products.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const checkoutSession = await Checkout.create({
    user: user._id,
    items: rawItems,
    total: Number(calculatedTotal.toFixed(2)),
  });

  res.status(200).json({
    message: "Checkout session created successfully!",
    data: checkoutSession,
  });
}

export default checkout;
