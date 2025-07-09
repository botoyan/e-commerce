import connectToDatabase from "../../../lib/mongoose";
import Products from "../../../models/Products";

async function handler(req, res) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const products = await Products.find();
      res.status(200).json({
        status: "OK",
        message: "Fetched products successfully",
        data: products,
      });
    } catch (err) {
      res.status(500).json({
        status: "ERROR",
        message: "Failed to fetch products!",
        error: err,
      });
    }
  }
  if (req.method === "POST") {
    try {
      const { name, brand, category, price, imageURI, menSizes, womenSizes } =
        req.body;
      const newProduct = await Products.create({
        name: name,
        brand: brand,
        category: category,
        price: price,
        imageURI: imageURI,
        menSizes: menSizes,
        womenSizes: womenSizes,
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
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} is not allowed!`);
  }
}

export default handler;

//TODO need to add other routes
