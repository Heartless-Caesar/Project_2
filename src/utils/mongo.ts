import mongoose from "mongoose";
import config from "config";

export async function connectToMongo() {
  try {
    await mongoose.connect(config.get("dbUri"));
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
