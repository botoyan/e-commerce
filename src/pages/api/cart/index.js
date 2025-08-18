import connectToDatabase from "../../../lib/mongoose";
import Cart from "../../../models/Cart";
import User from "../../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

async function addToCart(req, res) {
  await connectToDatabase();

  if (
    req.method !== "POST" &&
    req.method !== "GET" &&
    req.method !== "DELETE" &&
    req.method !== "PUT"
  ) {
    res.setHeader("Allow", ["POST", "GET", "DELETE", "PUT"]);
    res.status(405).end(`Method ${req.method} is not allowed!`);
    return;
  }

  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      res.status(403).json({ message: "No user logged in!" });
      return;
    }

    try {
      const { productId, shoeSize, sizeCategory } = req.body;

      if (!productId || !shoeSize || !sizeCategory) {
        res.status(400).json({
          message: "Missing productId, shoeSize, or sizeCategory!",
        });
        return;
      }

      let cart = await Cart.findOne({ user: user._id });

      if (!cart) {
        cart = new Cart({
          user: user._id,
          products: [
            {
              product: productId,
              sizeCategory,
              shoeSize,
              quantity: 1,
            },
          ],
        });
      } else {
        const productIndex = cart.products.findIndex(
          (item) =>
            item.product.toString() === productId &&
            item.sizeCategory === sizeCategory &&
            item.shoeSize === shoeSize
        );

        if (productIndex > -1) {
          cart.products[productIndex].quantity += 1;
        } else {
          cart.products.push({
            product: productId,
            sizeCategory,
            shoeSize,
            quantity: 1,
          });
        }
      }

      await cart.populate("products.product");

      cart.total = cart.products.reduce((acc, item) => {
        const price = item.product.price ?? 0;
        const quantity = item.quantity ?? 0;
        return acc + price * quantity;
      }, 0);

      await cart.save();

      if (!user.cart) {
        user.cart = cart._id;
        await user.save();
      }

      res.status(200).json({ message: "Added to cart", cart });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
      return;
    }
  }

  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      res.status(403).json({ message: "No user found!" });
      return;
    }

    const cart = await Cart.findOne({ user: user._id }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      res.status(200).json({
        message: "Cart is empty.",
        data: { products: [], total: 0 },
      });
      return;
    }

    cart.total = cart.products.reduce((acc, item) => {
      const price = item.product.price ?? 0;
      const quantity = item.quantity ?? 0;
      return acc + price * quantity;
    }, 0);

    await cart.save();

    res.status(200).json({
      message: "Cart fetched successfully.",
      data: {
        products: cart.products,
        total: cart.total,
      },
    });
    return;
  }

  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return res.status(403).json({ message: "No user found!" });
    }

    const { productId, sizeCategory, shoeSize } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Missing productId" });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart || cart.products.length === 0) {
      return res.status(200).json({
        message: "Cart is empty.",
        data: { products: [], total: 0 },
      });
    }

    cart.products = cart.products.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.sizeCategory === sizeCategory &&
          item.shoeSize === shoeSize
        )
    );

    await cart.populate("products.product");

    cart.total = cart.products.reduce((acc, item) => {
      const price = item.product.price ?? 0;
      const quantity = item.quantity ?? 0;
      return acc + price * quantity;
    }, 0);

    await cart.save();

    return res.status(200).json({
      message: "The item was removed from cart!",
      data: {
        products: cart.products,
        total: cart.total,
      },
    });
  }

  if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ message: "Unauthorized!" });
      return;
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      res.status(403).json({ message: "User not found!" });
      return;
    }
    const { productId, newQuantity, shoeSize, sizeCategory } = req.body;
    if (!productId || !newQuantity) {
      res.status(400).json({ message: "Missing productId or quantity!" });
      return;
    }
    const cart = await Cart.findOne({ user: user._id });
    if (!cart || cart.products.length === 0) {
      return res
        .status(200)
        .json({ message: "Cart is empty.", data: { products: [], total: 0 } });
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
    await cart.populate("products.product");
    cart.total = cart.products.reduce((acc, item) => {
      const price = item.product.price ?? 0;
      const quantity = item.quantity ?? 0;
      return acc + price * quantity;
    }, 0);

    await cart.save();

    return res.status(200).json({
      message: "The item's quantity was changed!",
      data: { products: cart.products, total: cart.total },
    });
  }
}
export default addToCart;
