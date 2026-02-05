import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer | null = null;

export async function setupMongoTestDB(): Promise<string> {
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
  }

  const connectionString = mongoServer.getUri();

  await mongoose.connect(connectionString);

  return connectionString;
}

export async function teardownMongoTestDB(): Promise<void> {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}

export async function clearMongoTestDB(): Promise<void> {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Mongoose is not connected');
  }

  const collections = await mongoose.connection.db?.collections();

  if (collections) {
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
}
