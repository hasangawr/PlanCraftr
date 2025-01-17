import { MongoMemoryServer } from 'mongodb-memory-server';
import config from './testDBConfig';

export default async function globalTeardown() {
  if (config.Memory) {
    // Config to decide if an mongodb-memory-server instance should be used
    const instance: MongoMemoryServer = globalThis.__MONGOINSTANCE;
    await instance.stop();
  }
}
