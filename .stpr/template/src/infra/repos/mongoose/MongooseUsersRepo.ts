import { UserDTO, toUserEntity } from '@/application-layer/dtos/UserDTO';
import { User } from '@/domain/entities/user/User';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

import UserMongo from './models/UserMongo';

export class MongooseUsersRepo implements UsersRepo {
  async getById(id: string): Promise<User | null> {
    const doc = await UserMongo.findOne({ id }).lean();

    return doc ? toUserEntity(doc as UserDTO, doc.hashedPassword) : null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const doc = await UserMongo.findOne({ email }).lean();

    return doc ? toUserEntity(doc as UserDTO, doc.hashedPassword) : null;
  }

  async getAll(): Promise<User[]> {
    const docs = await UserMongo.find().lean();

    return docs.map((doc) => toUserEntity(doc as UserDTO, doc.hashedPassword));
  }

  async save(user: User): Promise<void> {
    await UserMongo.findOneAndUpdate(
      { id: user.id },
      {
        ...user.toCreateProps(),
      },
      { upsert: true },
    );
  }

  async deleteById(id: string): Promise<void> {
    await UserMongo.deleteOne({ id });
  }
}
