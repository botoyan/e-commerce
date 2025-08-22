import connectToDatabase from "../../../../lib/mongoose";
import Checkout from "../../../../models/Checkout";
import Cart from "../../../../models/Cart";
import {
  getAuthenticatedUser,
  updateCheckoutTotal,
} from "../../../utils/checkout-helper";
import { updateCartTotal } from "../../../utils/cart-helper";
import Product from "../../../../models/Product";
import { sendOrderConfirmationEmail } from "../../../../lib/emails/orderLink";
import Order from "../../../../models/Order";

async function checkout(req, res) {
  console.log(Product);
  await connectToDatabase();
  if (
    req.method !== "GET" &&
    req.method !== "PUT" &&
    req.method !== "DELETE" &&
    req.method !== "POST"
  ) {
    res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
    res.status(405).end(`Method ${req.method} is not allowed!`);
    return;
  }
  if (req.method === "GET") {
    const user = await getAuthenticatedUser(req, res);
    const { id } = req.query;

    try {
      const checkout = await Checkout.findById(id).populate("items.product");

      if (!checkout) {
        res.status(404).json({ message: "Checkout not found" });
        return;
      }

      if (checkout.user.toString() !== user._id.toString()) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      res.status(200).json({ data: checkout });
    } catch (err) {
      console.error("Error fetching checkout:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  if (req.method === "DELETE") {
    const user = await getAuthenticatedUser(req, res);
    const { productId, sizeCategory, shoeSize } = req.body;
    const { id } = req.query;
    if (!productId || !sizeCategory || !shoeSize) {
      res.status(400).json({ message: "Missing required fields!" });
      return;
    }
    const cart = await Cart.findOne({ user: user._id });
    if (!cart || cart.products.length === 0) {
      res.status(200).json({
        message: "Cart is empty.",
        data: { products: [], total: 0 },
      });
      return;
    }
    cart.products = cart.products.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.sizeCategory === sizeCategory &&
          item.shoeSize === shoeSize
        )
    );
    await updateCartTotal(cart);

    const checkout = await Checkout.findById(id);
    if (!checkout) {
      res.status(404).json({ message: "Checkout not found" });
      return;
    }
    checkout.items = checkout.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.sizeCategory === sizeCategory &&
          item.shoeSize === shoeSize
        )
    );
    await updateCheckoutTotal(checkout);

    return res.status(200).json({
      message: "The item was removed from checkout and cart!",
      data: {
        user: user._id,
        items: checkout.items,
        total: checkout.total,
      },
    });
  }

  if (req.method === "PUT") {
    const user = await getAuthenticatedUser(req, res);
    const { productId, sizeCategory, shoeSize, newQuantity } = req.body;
    const { id } = req.query;
    if (!productId || !sizeCategory || !shoeSize) {
      res.status(400).json({ message: "Missing required fields!" });
      return;
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart || cart.products.length === 0) {
      res.status(200).json({
        message: "Cart is empty!",
        data: { products: [], total: 0 },
      });
      return;
    }
    cart.products = cart.products.map((item) => {
      if (
        item.product.toString() === productId &&
        item.shoeSize === shoeSize &&
        item.sizeCategory === sizeCategory
      ) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    await updateCartTotal(cart);

    const checkout = await Checkout.findById(id);
    if (!checkout || checkout.items.length === 0) {
      res.status(200).json({
        message: "Checkout is empty.",
        data: { products: [], total: 0 },
      });
      return;
    }
    checkout.items = checkout.items.map((item) => {
      if (
        item.product.toString() === productId &&
        item.shoeSize === shoeSize &&
        item.sizeCategory === sizeCategory
      ) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    await updateCheckoutTotal(checkout);

    return res.status(200).json({
      message: "The item's quantity was changed!",
      data: {
        user: user._id,
        items: checkout.items,
        total: checkout.total,
      },
    });
  }

  if (req.method === "POST") {
    const user = await getAuthenticatedUser(req, res);
    const { id } = req.query;
    const { name, email, streetAddress, city, state, zipCode } = req.body;
    if (
      !id ||
      !name ||
      !email ||
      !streetAddress ||
      !city ||
      !state ||
      !zipCode
    ) {
      res.status(400).json({ message: "Missing required fields!" });
      return;
    }
    const checkout = await Checkout.findById(id);
    if (!checkout || checkout.items.length === 0) {
      res.status(200).json({
        message: "Checkout is empty!",
        data: { products: [], total: 0 },
      });
      return;
    }

    const newOrder = new Order({
      user: user._id,
      products: checkout.items.map((item) => ({
        product: item.product._id,
        sizeCategory: item.sizeCategory,
        shoeSize: item.shoeSize,
        quantity: item.quantity,
      })),
      total: checkout.total,
      status: "pending",
    });

    await newOrder.save();

    const cart = await Cart.findOne({ user: user._id });
    if (cart) {
      cart.products = [];
      cart.total = 0;
      await cart.save();
    }

    await Checkout.findByIdAndDelete(id);

    await sendOrderConfirmationEmail(
      user.email,
      user.username,
      newOrder._id,
      newOrder.total
    );

    return res.status(201).json({
      message: "Order placed successfully!",
      data: {
        orderId: newOrder._id,
        total: newOrder.total,
        status: newOrder.status,
      },
    });
  }
}

export default checkout;
