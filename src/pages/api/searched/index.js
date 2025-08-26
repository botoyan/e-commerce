import connectToDatabase from "../../../lib/mongoose";
import Product from "../../../models/Product";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed.`);
  }

  try {
    const { searched } = req.body;
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

    if (!searched || typeof searched !== "string" || searched.trim() === "") {
      return res
        .status(400)
        .json({ message: "Invalid or missing search input" });
    }

    const searchQuery = {
      name: { $regex: searched, $options: "i" },
      ...query,
    };

    const searchedProducts = await Product.find(searchQuery).sort(
      sortingOption
    );

    return res.status(200).json({
      message: "Searched products fetched!",
      data: searchedProducts,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
