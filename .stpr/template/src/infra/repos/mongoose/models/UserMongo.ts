import mongoose from 'mongoose';

import { UserCreateProps } from '@/domain/entities/user/User';

const userSchema = new mongoose.Schema<UserCreateProps>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const UserMongo = mongoose.models.User || mongoose.model<UserCreateProps>('User', userSchema);

export default UserMongo;
