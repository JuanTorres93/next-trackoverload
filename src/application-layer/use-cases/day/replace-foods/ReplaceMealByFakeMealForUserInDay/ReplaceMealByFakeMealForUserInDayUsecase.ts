import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';
import { NotFoundError } from '@/domain/common/errors';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

export type ReplaceMealByFakeMealForUserInDayUsecaseRequest = {
  dayId: string;
  userId: string;
  mealIdToReplace: string;
  name: string;
  calories: number;
  protein: number;
};

export class ReplaceMealByFakeMealForUserInDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
    private mealsRepo: MealsRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private idGenerator: IdGenerator,
    private transactionContext: TransactionContext,
  ) {}

  async execute(
    request: ReplaceMealByFakeMealForUserInDayUsecaseRequest,
  ): Promise<DayDTO> {
    const [user, day] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.daysRepo.getDayByIdAndUserId(request.dayId, request.userId),
    ]);

    if (!user) {
      throw new NotFoundError(
        `ReplaceMealByFakeMealForUserInDayUsecase: User with id ${request.userId} not found`,
      );
    }

    if (!day) {
      throw new NotFoundError(
        `ReplaceMealByFakeMealForUserInDayUsecase: Day with id ${request.dayId} not found for user ${request.userId}`,
      );
    }

    const newFakeMeal = FakeMeal.create({
      id: this.idGenerator.generateId(),
      userId: request.userId,
      name: request.name,
      calories: request.calories,
      protein: request.protein,
    });

    day.removeMealById(request.mealIdToReplace);
    day.addFakeMeal(newFakeMeal.id);

    await this.transactionContext.run(async () => {
      await this.mealsRepo.deleteMeal(request.mealIdToReplace);
      await this.fakeMealsRepo.saveFakeMeal(newFakeMeal);
      await this.daysRepo.saveDay(day);
    });

    return toDayDTO(day);
  }
}
