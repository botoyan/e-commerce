import connectToDatabase from "../../../lib/mongoose";
import Checkout from "../../../models/Checkout";
import Cart from "../../../models/Cart";
import { getAuthenticatedUser } from "../../utils/checkout-helper";

async function checkout(req, res) {
  await connectToDatabase();
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} is not allowed!`);
    return;
  }
  const user = await getAuthenticatedUser(req, res);
  const cart = await Cart.findOne({ user: user._id }).populate(
    "products.product"
  );

  if (!cart || cart.products.length === 0) {
    return res.status(403).json({ message: "Cart is empty" });
  }

  const rawItems = cart.products.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    sizeCategory: item.sizeCategory,
    shoeSize: item.shoeSize,
  }));

  const calculatedTotal = cart.products.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  let checkoutSession = await Checkout.findOne({ user: user._id });

  if (checkoutSession) {
    checkoutSession.items = rawItems;
    checkoutSession.total = Number(calculatedTotal.toFixed(2));
    await checkoutSession.save();
  } else {
    checkoutSession = await Checkout.create({
      user: user._id,
      items: rawItems,
      total: Number(calculatedTotal.toFixed(2)),
    });
  }

  res.status(200).json({
    message: "Checkout session created successfully!",
    data: checkoutSession,
  });
}

export default checkout;
