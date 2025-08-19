import mongoose from "mongoose";
const Schema = mongoose.Schema;

const checkoutSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

const Checkout =
  mongoose.models.Checkout || mongoose.model("Checkout", checkoutSchema);
export default Checkout;
