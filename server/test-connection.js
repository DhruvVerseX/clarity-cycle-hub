// Simple MongoDB connection test
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
  try {
    console.log("Testing MongoDB connection...");
    console.log("Connection string:", process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully!");
    
    await mongoose.disconnect();
    console.log("✅ Connection test passed!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("Full error:", error);
  }
};

testConnection(); 