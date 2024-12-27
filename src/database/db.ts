import mongoose from "mongoose";

const MONODB_URI = "mongodb://localhost:27017/quoti-quoti";

export const connectDB = async () => {
  try {
    const database = await mongoose.connect(MONODB_URI);
    console.log(
      `🚧 MongoDB connected ${database.connection.host}:${database.connection.port}/${database.connection.name}`
    );
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};
