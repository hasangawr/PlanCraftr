import { Schema, model, connect } from "mongoose";
require("dotenv").config();

// 1. Create an interface representing a document in MongoDB.
interface IUser {
  name: string;
  email: string;
  avatar?: string;
}

const connectDB = async () => {
  // 2. Create a Schema corresponding to the document interface.
  const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String,
  });

  // 3. Create a Model.
  const User = model<IUser>("User", userSchema);

  try {
    // 4. Connect to MongoDB
    await connect(process.env.MONGODB_URI as string);

    console.log("Successfully connected to the database!");

    const user = new User({
      name: "Bill",
      email: "bill@initech1.com",
      avatar: "https://i.imgur.com/dM7Thhn.png",
    });

    await user.save();

    console.log(user.email); // 'bill@initech.com'
  } catch (error) {
    console.log("Couldn't connect to the database: ", error);
  }
};

export default connectDB;
