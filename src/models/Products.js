import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageURI: {
      type: String,
      required: true,
    },
    menSizes: {
      type: [String],
    },
    womenSizes: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Products ||
  mongoose.model("Products", ProductsSchema);

//TODO need to add more schemas
