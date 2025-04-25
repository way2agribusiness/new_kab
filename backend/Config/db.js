import mongoose from "mongoose";
import dotenv from "dotenv";
import "colors";

dotenv.config();

const ConnectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);

    console.log(
      `MongoDB is Connected Successfully ;) ${conn.connection.host}`.bgGreen
        .bold
    );
  } catch (error) {
    console.error(
      `MongoDB Connection Failed :(  ${error.message}`.bgRed.white.bold
    );
    process.exit(1);
  }
};

export default ConnectDB;
