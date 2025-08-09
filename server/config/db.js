import mongoose from "mongoose";

/**
 * Establish a MongoDB connection using either MONGO_URI or MONGODB_URI.
 * Supports both to avoid env naming mismatches.
 */
const connectDB = async () => {
  try {
    // Prefer MONGODB_URI (commonly used for Atlas), fall back to MONGO_URI
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error("Missing MONGO_URI or MONGODB_URI in environment variables");
    }
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ MongoDB connection failed:", message);
    process.exit(1);
  }
};

export default connectDB;
