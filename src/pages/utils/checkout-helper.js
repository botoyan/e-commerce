import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import User from "../../models/User";

export async function getAuthenticatedUser(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    res.status(403).json({ message: "User not found" });
    return null;
  }

  if (!user.cart) {
    res.status(403).json({ message: "Cart is empty!" });
    return null;
  }

  return user;
}

export async function updateCheckoutTotal(checkout) {
  await checkout.populate("items.product");
  checkout.total = checkout.items.reduce((acc, item) => {
    const price = item.product.price ?? 0;
    const quantity = item.quantity ?? 0;
    return acc + price * quantity;
  }, 0);
  await checkout.save();
  return checkout;
}
