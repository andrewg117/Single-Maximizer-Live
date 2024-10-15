import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";
dotenv.config();

const MDB_URI: string = process.env.MDB_URI as string;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MDB_URI);
    console.log(
      colors.cyan.underline(`MongoDB connected: ${conn.connection.host}`)
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    console.log(colors.cyan.underline("MongoDB disconnected"));
    await mongoose.disconnect();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
