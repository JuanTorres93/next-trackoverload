import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import {
  FakeMealDTO,
  toFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import { BaseFileSystemRepo } from './BaseFileSystemRepo';

export class FileSystemFakeMealsRepo
  extends BaseFileSystemRepo<FakeMeal>
  implements FakeMealsRepo
{
  constructor() {
    super('fake-meals.json');
  }

  protected getItemId(item: FakeMeal): string {
    return item.id;
  }

  protected serializeItems(items: FakeMeal[]): FakeMealDTO[] {
    return items.map(toFakeMealDTO);
  }

  protected deserializeItems(data: unknown[]): FakeMeal[] {
    return (data as FakeMealDTO[]).map((item) =>
      FakeMeal.create({
        id: item.id,
        userId: item.userId,
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })
    );
  }

  async saveFakeMeal(fakeMeal: FakeMeal): Promise<void> {
    return this.saveItem(fakeMeal);
  }

  async getAllFakeMeals(): Promise<FakeMeal[]> {
    return this.getAllItems();
  }

  async getAllFakeMealsByUserId(userId: string): Promise<FakeMeal[]> {
    const fakeMeals = await this.getAllItems();
    return fakeMeals.filter((fakeMeal) => fakeMeal.userId === userId);
  }

  async getFakeMealById(id: string): Promise<FakeMeal | null> {
    return this.getItemById(id);
  }

  async getFakeMealByIdAndUserId(
    id: string,
    userId: string
  ): Promise<FakeMeal | null> {
    const fakeMeal = await this.getItemById(id);
    return fakeMeal && fakeMeal.userId === userId ? fakeMeal : null;
  }

  async deleteFakeMeal(id: string): Promise<void> {
    return this.deleteItemById(id);
  }

  async deleteFakeMealByIdAndUserId(id: string, userId: string): Promise<void> {
    const fakeMeal = await this.getFakeMealByIdAndUserId(id, userId);
    if (!fakeMeal) {
      return Promise.reject(null);
    }
    return this.deleteItemById(id);
  }
}
