import connectToDatabase from "../../../lib/mongoose";
import Product from "../../../models/Product";

async function handler(req, res) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const { sorting, mensizes, womensizes, prices, categories } = req.query;
      const query = {};
      if (categories) {
        const categoryList = categories.toLowerCase().split("+");
        query.category = { $in: categoryList };
      }
      if (mensizes) {
        const sizes = mensizes.split("+").map(Number);
        query.menSizes = { $in: sizes };
      }
      if (womensizes) {
        const sizes = womensizes.split("+").map(Number);
        query.womenSizes = { $in: sizes };
      }
      if (prices) {
        const [minPrice, maxPrice] = prices.split("-").map(Number);
        query.price = { $gte: minPrice, $lte: maxPrice };
      }
      const sortingOption = {};
      if (sorting) {
        if (sorting.toLowerCase() === "price: low to high") {
          sortingOption.price = 1;
        }
        if (sorting.toLowerCase() === "price: high to low") {
          sortingOption.price = -1;
        }
        if (sorting.toLowerCase() === "best discount") {
          sortingOption.createdAt = -1;
        }
        if (sorting.toLowerCase() === "recommended") {
          sortingOption.createdAt = 1;
        }
      }
      const products = await Product.find(query).sort(sortingOption);
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
