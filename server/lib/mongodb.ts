// lib/mongodb.ts
import mongoose from "mongoose"

// Correctly accessing the MONGODB_URI environment variable using bracket notation
const MONGODB_URI = process.env["MONGODB_URI"]

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Correctly accessing the global object and casting it to a type that allows accessing properties dynamically
const globalWithMongoose = global as { mongoose?: { conn: null | mongoose.Mongoose; promise: null | Promise<mongoose.Mongoose> } }

let cached = globalWithMongoose.mongoose || { conn: null, promise: null }

async function dbConnect() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    // Ensuring MONGODB_URI is defined and not undefined before attempting to connect
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is undefined");
    }
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose)
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
