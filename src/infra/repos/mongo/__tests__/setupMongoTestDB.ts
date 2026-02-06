import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoReplSet: MongoMemoryReplSet | null = null;

export async function setupMongoTestDB(): Promise<string> {
  if (!mongoReplSet) {
    mongoReplSet = await MongoMemoryReplSet.create({
      replSet: {
        name: 'testReplicaSet',
        count: 1,
        storageEngine: 'wiredTiger', // Needed for transactions
      },
    });
  }

  const uri = mongoReplSet.getUri();

  await mongoose.connect(uri);

  return uri;
}

export async function teardownMongoTestDB(): Promise<void> {
  await mongoose.disconnect();

  if (mongoReplSet) {
    await mongoReplSet.stop();
    mongoReplSet = null;
  }
}

export async function clearMongoTestDB(): Promise<void> {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Mongoose is not connected');
  }

  const collections = await mongoose.connection.db!.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}
