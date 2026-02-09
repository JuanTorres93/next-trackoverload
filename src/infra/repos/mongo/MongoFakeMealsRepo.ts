import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import FakeMealMongo from './models/FakeMealMongo';
import { FakeMealCreateProps } from '@/domain/entities/fakemeal/FakeMeal';
import { withTransaction } from './common/withTransaction';

export class MongoFakeMealsRepo implements FakeMealsRepo {
  async saveFakeMeal(fakeMeal: FakeMeal): Promise<void> {
    return withTransaction(async (session) => {
      const fakeMealData: FakeMealCreateProps = fakeMeal.toCreateProps();

      await FakeMealMongo.findOneAndUpdate({ id: fakeMeal.id }, fakeMealData, {
        upsert: true,
        new: true,
        session,
      });
    });
  }

  async getAllFakeMeals(): Promise<FakeMeal[]> {
    const fakeMealDocs = await FakeMealMongo.find({}).lean();

    return fakeMealDocs.map((doc) => FakeMeal.create(doc));
  }

  async getAllFakeMealsByUserId(userId: string): Promise<FakeMeal[]> {
    const fakeMealDocs = await FakeMealMongo.find({ userId }).lean();

    return fakeMealDocs.map((doc) => FakeMeal.create(doc));
  }

  async getFakeMealById(id: string): Promise<FakeMeal | null> {
    const doc = await FakeMealMongo.findOne({ id }).lean();

    if (!doc) {
      return null;
    }

    return FakeMeal.create(doc);
  }

  async getFakeMealByIds(ids: string[]): Promise<FakeMeal[]> {
    const fakeMealDocs = await FakeMealMongo.find({ id: { $in: ids } }).lean();

    return fakeMealDocs.map((doc) => FakeMeal.create(doc));
  }

  async getFakeMealByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<FakeMeal | null> {
    const doc = await FakeMealMongo.findOne({ id, userId }).lean();

    if (!doc) {
      return null;
    }

    return FakeMeal.create(doc);
  }

  async deleteFakeMeal(id: string): Promise<void> {
    return withTransaction(async (session) => {
      const result = await FakeMealMongo.deleteOne({ id }, { session });

      if (result.deletedCount === 0) {
        return Promise.reject(null);
      }
    });
  }

  async deleteMultipleFakeMeals(ids: string[]): Promise<void> {
    return withTransaction(async (session) => {
      await FakeMealMongo.deleteMany({ id: { $in: ids } }, { session });
    });
  }

  async deleteFakeMealByIdAndUserId(id: string, userId: string): Promise<void> {
    return withTransaction(async (session) => {
      const result = await FakeMealMongo.deleteOne({ id, userId }, { session });

      if (result.deletedCount === 0) {
        return Promise.reject(null);
      }
    });
  }

  async deleteAllFakeMealsForUser(userId: string): Promise<void> {
    return withTransaction(async (session) => {
      await FakeMealMongo.deleteMany({ userId }, { session });
    });
  }
}
