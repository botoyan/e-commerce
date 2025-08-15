import connectToDatabase from "../../../lib/mongoose";
import Product from "../../../models/Product";

async function handler(req, res) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const products = await Product.find();
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
    return;
  }
  res.setHeader("Allow", ["GET"]);
  res.status(405).end(`Method ${req.method} is not allowed!`);
}

export default handler;
