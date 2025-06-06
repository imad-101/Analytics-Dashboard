import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let isConnected = false;

export async function connectToDatabase() {
  try {
    if (isConnected) {
      return { db: mongoose.connection.db };
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    isConnected = true;
    console.log("MongoDB Atlas connected successfully");
    return { db: mongoose.connection.db };
  } catch (error) {
    console.error("MongoDB Atlas connection error:", error);
    isConnected = false;
    throw new Error(
      `Failed to connect to MongoDB Atlas: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
