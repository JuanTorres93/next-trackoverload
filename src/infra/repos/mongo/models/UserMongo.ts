import mongoose from 'mongoose';
import { UserCreateProps, nameTextOptions } from '@/domain/entities/user/User';

const userSchema = new mongoose.Schema<
  UserCreateProps & { hasValidSubscription?: boolean }
>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: nameTextOptions.maxLength.value,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true, // NOTE: Turn to false when implementing OAuth2.0 or similar where password is not stored in system
  },
  customerId: {
    type: String,
    required: false,
  },
  subscriptionStatus: {
    type: String,
    required: false,
  },
  subscriptionEndsAt: {
    type: Date,
    required: false,
  },
  hasValidSubscription: {
    type: Boolean,
    required: false,
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

const UserMongo =
  mongoose.models.User || mongoose.model<UserCreateProps>('User', userSchema);

export default UserMongo;
