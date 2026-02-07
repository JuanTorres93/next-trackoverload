import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { User } from '@/domain/entities/user/User';
import UserMongo from './models/UserMongo';
import { UserCreateProps } from '@/domain/entities/user/User';

export class MongoUsersRepo implements UsersRepo {
  async saveUser(user: User): Promise<void> {
    const userData: UserCreateProps = user.toCreateProps();

    await UserMongo.findOneAndUpdate({ id: user.id }, userData, {
      upsert: true,
      new: true,
    });
  }

  async getAllUsers(): Promise<User[]> {
    const userDocs = await UserMongo.find({}).lean();

    return userDocs.map((doc) => User.create(doc));
  }

  async getUserById(id: string): Promise<User | null> {
    const doc = await UserMongo.findOne({ id }).lean();

    if (!doc) {
      return null;
    }

    return User.create(doc);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const doc = await UserMongo.findOne({ email }).lean();

    if (!doc) {
      return null;
    }

    return User.create(doc);
  }

  async getUserByCustomerId(customerId: string): Promise<User | null> {
    const doc = await UserMongo.findOne({ customerId }).lean();

    if (!doc) {
      return null;
    }

    return User.create(doc);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await UserMongo.deleteOne({ id });

    if (result.deletedCount === 0) {
      return Promise.reject(null);
    }
  }
}
