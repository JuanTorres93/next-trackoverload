import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { Id } from '@/domain/types/Id/Id';
import { ValidationError } from '@/domain/common/errors';
import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';

export type AddMealToDayUsecaseRequest = {
  date: Date;
  userId: string;
  mealId: string;
};

export class AddMealToDayUsecase {
  constructor(private daysRepo: DaysRepo, private mealsRepo: MealsRepo) {}

  async execute(request: AddMealToDayUsecaseRequest): Promise<DayDTO> {
    const meal = await this.mealsRepo.getMealById(request.mealId);
    if (!meal) {
      throw new ValidationError(`Meal with id ${request.mealId} not found`);
    }

    let day = await this.daysRepo.getDayByIdAndUserId(
      request.date.toISOString(),
      request.userId
    );
    if (!day) {
      // NOTE: date and userId are validated in the entity
      day = Day.create({
        id: request.date,
        userId: Id.create(request.userId),
        meals: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    day.addMeal(meal);
    await this.daysRepo.saveDay(day);

    return toDayDTO(day);
  }
}
