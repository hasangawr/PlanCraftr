import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env['MONGO_URI'] as string);
});

afterEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  // const collections = await mongoose.connection.db?.collections();
  // if (collections) {
  //   for (const collection of collections) {
  //     await collection.deleteMany({});
  //   }
  // }
  await mongoose.disconnect();
  //return new Promise((resolve) => setTimeout(resolve, 1000));
  //console.log(process.getActiveResourcesInfo());
});
