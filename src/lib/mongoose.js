import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in your .env.local");
}

async function connectToDatabase() {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected!");
}

export default connectToDatabase;

//TODO need to add better code
