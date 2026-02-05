import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import FakeMealMongo from './models/FakeMealMongo';
import { FakeMealCreateProps } from '@/domain/entities/fakemeal/FakeMeal';

export class MongoFakeMealsRepo implements FakeMealsRepo {
  async saveFakeMeal(fakeMeal: FakeMeal): Promise<void> {
    const fakeMealData: FakeMealCreateProps = fakeMeal.toCreateProps();

    await FakeMealMongo.findOneAndUpdate({ id: fakeMeal.id }, fakeMealData, {
      upsert: true,
      new: true,
    });
  }

  async getAllFakeMeals(): Promise<FakeMeal[]> {
    const fakeMealDocs = await FakeMealMongo.find({}).lean();

    return fakeMealDocs.map((doc) =>
      FakeMeal.create({
        id: doc.id,
        userId: doc.userId,
        name: doc.name,
        calories: doc.calories,
        protein: doc.protein,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }

  async getAllFakeMealsByUserId(userId: string): Promise<FakeMeal[]> {
    const fakeMealDocs = await FakeMealMongo.find({ userId }).lean();

    return fakeMealDocs.map((doc) =>
      FakeMeal.create({
        id: doc.id,
        userId: doc.userId,
        name: doc.name,
        calories: doc.calories,
        protein: doc.protein,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }

  async getFakeMealById(id: string): Promise<FakeMeal | null> {
    const doc = await FakeMealMongo.findOne({ id }).lean();

    if (!doc) {
      return null;
    }

    return FakeMeal.create({
      id: doc.id,
      userId: doc.userId,
      name: doc.name,
      calories: doc.calories,
      protein: doc.protein,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async getFakeMealByIds(ids: string[]): Promise<FakeMeal[]> {
    const fakeMealDocs = await FakeMealMongo.find({ id: { $in: ids } }).lean();

    return fakeMealDocs.map((doc) =>
      FakeMeal.create({
        id: doc.id,
        userId: doc.userId,
        name: doc.name,
        calories: doc.calories,
        protein: doc.protein,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }

  async getFakeMealByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<FakeMeal | null> {
    const doc = await FakeMealMongo.findOne({ id, userId }).lean();

    if (!doc) {
      return null;
    }

    return FakeMeal.create({
      id: doc.id,
      userId: doc.userId,
      name: doc.name,
      calories: doc.calories,
      protein: doc.protein,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async deleteFakeMeal(id: string): Promise<void> {
    const result = await FakeMealMongo.deleteOne({ id });

    if (result.deletedCount === 0) {
      return Promise.reject(null);
    }
  }

  async deleteMultipleFakeMeals(ids: string[]): Promise<void> {
    await FakeMealMongo.deleteMany({ id: { $in: ids } });
  }

  async deleteFakeMealByIdAndUserId(id: string, userId: string): Promise<void> {
    const result = await FakeMealMongo.deleteOne({ id, userId });

    if (result.deletedCount === 0) {
      return Promise.reject(null);
    }
  }

  async deleteAllFakeMealsForUser(userId: string): Promise<void> {
    await FakeMealMongo.deleteMany({ userId });
  }
}
