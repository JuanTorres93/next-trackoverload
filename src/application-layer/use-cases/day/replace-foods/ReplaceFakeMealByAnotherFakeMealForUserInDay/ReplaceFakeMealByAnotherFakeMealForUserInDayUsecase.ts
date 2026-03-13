import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';
import { NotFoundError } from '@/domain/common/errors';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

export type ReplaceFakeMealByAnotherFakeMealForUserInDayUsecaseRequest = {
  fakeMealIdToReplace: string;
  dayId: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
};

export class ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private idGenerator: IdGenerator,
    private transactionContext: TransactionContext,
  ) {}

  async execute(
    request: ReplaceFakeMealByAnotherFakeMealForUserInDayUsecaseRequest,
  ): Promise<DayDTO> {
    const [user, day] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.daysRepo.getDayByIdAndUserId(request.dayId, request.userId),
    ]);

    if (!user) {
      throw new NotFoundError(
        `ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase: User with id ${request.userId} not found`,
      );
    }

    if (!day) {
      throw new NotFoundError(
        `ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase: Day with id ${request.dayId} not found for user ${request.userId}`,
      );
    }

    const newFakeMeal = FakeMeal.create({
      id: this.idGenerator.generateId(),
      userId: request.userId,
      name: request.name,
      calories: request.calories,
      protein: request.protein,
    });

    day.removeFakeMealById(request.fakeMealIdToReplace);
    day.addFakeMeal(newFakeMeal.id);

    await this.transactionContext.run(async () => {
      await this.fakeMealsRepo.deleteFakeMeal(request.fakeMealIdToReplace);
      await this.fakeMealsRepo.saveFakeMeal(newFakeMeal);
      await this.daysRepo.saveDay(day);
    });

    return toDayDTO(day);
  }
}
