import connectToDatabase from "../../../lib/mongoose";
import Product from "../../../models/Product";

async function addProduct(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    /**
     * const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user || user.userType !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }
     */
    try {
      const { name, brand, category, price, imageURI, menSizes, womenSizes } =
        req.body;
      const newProduct = await Product.create({
        name,
        brand,
        category,
        price,
        imageURI,
        menSizes,
        womenSizes,
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
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} is not allowed!`);
  }
}

export default addProduct;
