import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { FakeMealDTO } from '@/application-layer/dtos/FakeMealDTO';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { MealDTO } from '@/application-layer/dtos/MealDTO';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { BaseFileSystemRepo } from './BaseFileSystemRepo';
export class FileSystemDaysRepo
  extends BaseFileSystemRepo<Day>
  implements DaysRepo
{
  constructor() {
    super('days.json');
  }

  protected getItemId(item: Day): string {
    return item.id.toISOString().split('T')[0]; // Use date as string ID
  }

  protected serializeItems(items: Day[]): DayDTO[] {
    return items.map(toDayDTO);
  }

  protected deserializeItems(data: unknown[]): Day[] {
    return (data as DayDTO[]).map((item) => {
      const meals = item.meals.map((mealData: MealDTO | FakeMealDTO) => {
        if ('ingredientLines' in mealData) {
          const ingredientLines = (mealData as MealDTO).ingredientLines.map(
            (lineData: IngredientLineDTO) => {
              const ingredient = Ingredient.create({
                ...lineData.ingredient,
                calories: lineData.ingredient.nutritionalInfoPer100g.calories,
                protein: lineData.ingredient.nutritionalInfoPer100g.protein,
                createdAt: new Date(lineData.ingredient.createdAt),
                updatedAt: new Date(lineData.ingredient.updatedAt),
              });

              return IngredientLine.create({
                ...lineData,
                ingredient,
                createdAt: new Date(lineData.createdAt),
                updatedAt: new Date(lineData.updatedAt),
              });
            }
          );

          return Meal.create({
            ...mealData,
            ingredientLines,
            createdAt: new Date(mealData.createdAt),
            updatedAt: new Date(mealData.updatedAt),
          });
        } else {
          const fakeMealData = mealData as FakeMealDTO;
          return FakeMeal.create({
            ...fakeMealData,
            createdAt: new Date(fakeMealData.createdAt),
            updatedAt: new Date(fakeMealData.updatedAt),
          });
        }
      });

      return Day.create({
        ...item,
        id: new Date(item.id),
        meals,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      });
    });
  }

  async saveDay(day: Day): Promise<void> {
    return this.saveItem(day);
  }

  async getAllDays(): Promise<Day[]> {
    return this.getAllItems();
  }

  async getAllDaysByUserId(userId: string): Promise<Day[]> {
    const days = await this.getAllItems();
    return days.filter((day) => day.userId === userId);
  }

  async getDayById(id: string): Promise<Day | null> {
    return this.getItemById(id);
  }

  async getDayByIdAndUserId(id: string, userId: string): Promise<Day | null> {
    const day = await this.getItemById(id);
    return day && day.userId === userId ? day : null;
  }

  async getDaysByDateRange(startDate: Date, endDate: Date): Promise<Day[]> {
    const days = await this.getAllItems();
    return days.filter((day) => {
      const dayDate = day.id;
      return dayDate >= startDate && dayDate <= endDate;
    });
  }

  async getDaysByDateRangeAndUserId(
    startDate: Date,
    endDate: Date,
    userId: string
  ): Promise<Day[]> {
    const days = await this.getAllItems();
    return days.filter((day) => {
      const dayDate = day.id;
      return (
        dayDate >= startDate && dayDate <= endDate && day.userId === userId
      );
    });
  }

  async deleteDay(id: string): Promise<void> {
    return this.deleteItemById(id);
  }
}
