import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type AddMealToDayUsecaseRequest = {
  date: Date;
  userId: string;
  mealId: string;
};

export class AddMealToDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private mealsRepo: MealsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(request: AddMealToDayUsecaseRequest): Promise<DayDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `AddMealToDayUsecase: user with id ${request.userId} not found`
      );
    }

    const meal = await this.mealsRepo.getMealByIdForUser(
      request.mealId,
      request.userId
    );

    if (!meal) {
      throw new NotFoundError(
        `AddMealToDayUsecase: meal with id ${request.mealId} not found`
      );
    }

    let day = await this.daysRepo.getDayByIdAndUserId(
      request.date.toISOString(),
      request.userId
    );

    if (!day) {
      // NOTE: date and userId are validated in the entity
      day = Day.create({
        id: request.date,
        userId: request.userId,
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
