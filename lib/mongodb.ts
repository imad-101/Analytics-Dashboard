import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return { db: mongoose.connection.db };
    }

    await mongoose.connect(MONGODB_URI);
    return { db: mongoose.connection.db };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
