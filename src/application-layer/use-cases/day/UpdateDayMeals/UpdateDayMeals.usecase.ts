import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Meal } from '@/domain/entities/meal/Meal';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';

export type UpdateDayMealsUsecaseRequest = {
  date: Date;
  userId: string;
  meals: (Meal | FakeMeal)[];
};

export class UpdateDayMealsUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: UpdateDayMealsUsecaseRequest): Promise<DayDTO> {
    let day = await this.daysRepo.getDayByIdAndUserId(
      request.date.toISOString(),
      request.userId
    );

    if (!day) {
      day = Day.create({
        id: request.date,
        userId: request.userId,
        meals: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // NOTE: userId and meal validation is done inside the Day entity
    // Create a new day with updated meals
    const updatedDay = Day.create({
      id: day.id,
      userId: day.userId,
      meals: [...request.meals], // Replace all meals
      createdAt: day.createdAt,
      updatedAt: new Date(),
    });

    await this.daysRepo.saveDay(updatedDay);

    return toDayDTO(updatedDay);
  }
}
