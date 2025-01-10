import { connect } from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
  try {
    // 4. Connect to MongoDB
    await connect(process.env.MONGODB_URI as string);

    console.log(
      `Successfully connected to the ${process.env.NODE_ENV} database!`,
    );

    // const user = new User({
    //   name: 'Bill',
    //   email: 'bill@initech1.com',
    //   authType: 'direct',
    //   password: 'test',
    // });

    // await user.save();

    // console.log(user.email); // 'bill@initech.com'
  } catch (error) {
    console.log("Couldn't connect to the database: ", error);
  }
};

export const connectTestDB = async () => {
  try {
    await connect(process.env['MONGO_URI'] as string);
    console.log('Successfully connected to the test database!');
  } catch (error) {
    console.log("Couldn't connect to the test database: ", error);
  }
};

export default connectDB;
