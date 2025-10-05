import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { Meal } from '@/domain/entities/meal/Meal';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { validateDate } from '@/domain/common/validation';

export type UpdateDayMealsUsecaseRequest = {
  date: Date;
  meals: (Meal | FakeMeal)[];
};

export class UpdateDayMealsUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: UpdateDayMealsUsecaseRequest): Promise<Day> {
    validateDate(request.date, 'UpdateDayMealsUsecase: date');

    let day = await this.daysRepo.getDayById(request.date.toISOString());

    if (!day) {
      day = Day.create({
        id: request.date,
        meals: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // NOTE: meal validation is done inside the Day entity
    // Create a new day with updated meals
    const updatedDay = Day.create({
      id: day.id,
      meals: [...request.meals], // Replace all meals
      createdAt: day.createdAt,
      updatedAt: new Date(),
    });

    await this.daysRepo.saveDay(updatedDay);

    return updatedDay;
  }
}
