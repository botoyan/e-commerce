import connectToDatabase from "../../../lib/mongoose";
import Product from "../../../models/Product";
import User from "../../../models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

async function addProduct(req, res) {
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
  if (!user || user.userType !== "admin") {
    res.status(403).json({ message: "Forbidden: Admins only" });
    return;
  }
  try {
    const {
      name,
      brand,
      category,
      price,
      imageURI,
      menSizes,
      womenSizes,
      features,
    } = req.body;
    if (
      !name ||
      !brand ||
      !category ||
      !price ||
      !Array.isArray(menSizes) ||
      !Array.isArray(womenSizes) ||
      !Array.isArray(features)
    ) {
      return res.status(400).json({
        status: "ERROR",
        message: "Missing or invalid product fields",
      });
    }
    const newProduct = await Product.create({
      name,
      brand,
      category,
      price,
      imageURI,
      menSizes,
      womenSizes,
      features,
    });
    res.status(201).json({
      status: "CREATED",
      message: "Product added successfully!",
      data: newProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "ERROR",
      message: "Invalid request",
      error: err.message,
    });
  }
}

export default addProduct;
