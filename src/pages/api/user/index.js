import connectToDatabase from "../../../lib/mongoose";
import Order from "../../../models/Order";
import { getAuthenticatedUser } from "../../utils/cart-helper";

export default async function handler(req, res) {
  await connectToDatabase();
  if (req.method !== "PUT" && req.method !== "GET") {
    res.setHeader("Allow", ["PUT", "GET"]);
    res.status(405).end(`Method ${req.method} is not allowed!`);
    return;
  }
  if (req.method === "GET") {
    const user = await getAuthenticatedUser(req, res);
    const orders = await Order.find({ user: user._id });
    res.status(200).json({
      message: "User details",
      data: {
        user: {
          email: user.email,
          username: user.username,
        },
        orders,
      },
    });
  }
  if (req.method === "PUT") {
  }
}
