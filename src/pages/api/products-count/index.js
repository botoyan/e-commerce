import connectToDatabase from "../../../lib/mongoose";
import Product from "../../../models/Product";

async function handler(req, res) {
  await connectToDatabase();

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed.`);
  }

  try {
    const totalCount = await Product.countDocuments();
    return res.status(200).json({
      message: "Total count of products!",
      data: totalCount,
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default handler;
