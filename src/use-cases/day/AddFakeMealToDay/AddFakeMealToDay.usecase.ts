import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { ValidationError } from '@/domain/common/errors';

export type AddFakeMealToDayUsecaseRequest = {
  date: Date;
  fakeMealId: string;
};

export class AddFakeMealToDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private fakeMealsRepo: FakeMealsRepo
  ) {}

  async execute(request: AddFakeMealToDayUsecaseRequest): Promise<Day> {
    const fakeMeal = await this.fakeMealsRepo.getFakeMealById(
      request.fakeMealId
    );
    if (!fakeMeal) {
      throw new ValidationError(
        `FakeMeal with id ${request.fakeMealId} not found`
      );
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

    day.addMeal(fakeMeal);
    await this.daysRepo.saveDay(day);

    return day;
  }
}
