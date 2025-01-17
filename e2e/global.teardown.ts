import { test as teardown } from "@playwright/test";
import mongoose from "mongoose";

teardown("cleanup database", async () => {
  console.log("cleaning the database...");
  const conn = await mongoose
    .createConnection(process.env.PLAYWRIGHT_TEST_MONGO_URI as string)
    .asPromise();

  const db = conn.useDb("PlanCraftr");

  if (db.readyState === 1) {
    const collections = await db.listCollections();

    for (let collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  }

  await conn.close();
});
