import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { ValidationError } from '@/domain/common/errors';

export type AddMealToDayUsecaseRequest = {
  date: Date;
  mealId: string;
};

export class AddMealToDayUsecase {
  constructor(private daysRepo: DaysRepo, private mealsRepo: MealsRepo) {}

  async execute(request: AddMealToDayUsecaseRequest): Promise<Day> {
    const meal = await this.mealsRepo.getMealById(request.mealId);
    if (!meal) {
      throw new ValidationError(`Meal with id ${request.mealId} not found`);
    }

    let day = await this.daysRepo.getDayById(request.date.toISOString());
    if (!day) {
      // NOTE: date is validated in the entity
      day = Day.create({
        id: request.date,
        meals: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    day.addMeal(meal);
    await this.daysRepo.saveDay(day);

    return day;
  }
}
