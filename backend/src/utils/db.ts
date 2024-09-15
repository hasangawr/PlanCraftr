import { connect } from "mongoose";
require("dotenv").config();

const connectDB = async () => {
  try {
    // 4. Connect to MongoDB
    await connect(process.env.MONGODB_URI as string);

    console.log("Successfully connected to the database!");

    // const user = new User({
    //   name: "Bill",
    //   email: "bill@initech1.com",
    //   avatar: "https://i.imgur.com/dM7Thhn.png",
    // });

    // await user.save();

    // console.log(user.email); // 'bill@initech.com'
  } catch (error) {
    console.log("Couldn't connect to the database: ", error);
  }
};

export default connectDB;
