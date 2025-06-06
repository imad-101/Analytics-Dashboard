import mongoose from "mongoose";

declare global {
  // Prevent hot-reload issues in development
  // eslint-disable-next-line no-var
  var mongooseConn: typeof mongoose | null;
  // eslint-disable-next-line no-var
  var mongoosePromise: Promise<typeof mongoose> | null;
}

if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!global.mongooseConn) {
  global.mongooseConn = null;
}
if (!global.mongoosePromise) {
  global.mongoosePromise = null;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (global.mongooseConn) {
    return global.mongooseConn;
  }

  if (!global.mongoosePromise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 5,
      family: 4,
      retryWrites: true,
      retryReads: true,
    };
    global.mongoosePromise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    global.mongooseConn = await global.mongoosePromise;
    console.log("Connected to MongoDB Atlas");
  } catch (e) {
    global.mongoosePromise = null;
    console.error("MongoDB connection error:", e);
    throw e;
  }

  return global.mongooseConn!;
}
