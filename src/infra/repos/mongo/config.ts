import { InfrastructureError } from '../../../domain/common/errors';
import mongoose from 'mongoose';

const MONGODB_USERNAME = process.env.MONGODB_USERNAME_DEV;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD_DEV;

export const MONGODB_URI_DEV = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.pjn69gs.mongodb.net/?appName=Cluster0`;

export async function getMongooseInstance(uri: string) {
  await mongoose.connect(uri);
}

export async function getMongooseDevelopmentInstance() {
  if (process.env.NODE_ENV !== 'development')
    throw new InfrastructureError(
      'getMongooseDevelopmentInstance: Not in development environment',
    );

  await getMongooseInstance(MONGODB_URI_DEV);
}
