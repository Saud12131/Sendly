import { MongoClient, ServerApiVersion } from 'mongodb';
import Agenda from 'agenda';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const agenda = new Agenda({
  db: { address: uri, collection: 'agendaJobs' },
});


export default async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    await agenda.start();
    console.log("✅ Agenda started");

    return client;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
export const connectWithMongoose = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
    process.exit(1);
  }
};

export { agenda };
