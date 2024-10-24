import { connect } from "mongoose";
import { config } from "dotenv";
config();
const dbConnection = async () => {
  try {
    await connect(
      // "mongodb+srv://debanshubrahma1234:debanshubrahma1234@debtweet.jxllc.mongodb.net/", 
      process.env.MONGODB_URI,
    )
      .then(() => console.log("MongoDB connected"))

      .catch((err) => console.error("MongoDB connection error:", err));
    // console.log('Database connected successfully');
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default dbConnection;
