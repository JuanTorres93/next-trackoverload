import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';
import { Day } from '@/domain/entities/day/Day';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
import { createDayNoSaveInRepo } from '../common/createDayNoSaveInRepo';

export type AddFakeMealToDayUsecaseRequest = {
  dayId: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
};

export class AddFakeMealToDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
    private transactionContext: TransactionContext,
  ) {}

  async execute(request: AddFakeMealToDayUsecaseRequest): Promise<DayDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `AddFakeMealToDayUsecase: User with id ${request.userId} not found`,
      );
    }

    let dayToAddFakeMeal: Day | null;

    dayToAddFakeMeal = await this.daysRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId,
    );

    if (!dayToAddFakeMeal) {
      const { day, month, year } = dayIdToDayMonthYear(request.dayId);

      dayToAddFakeMeal = await createDayNoSaveInRepo(
        this.usersRepo,
        this.daysRepo,
        {
          day,
          month,
          year,
          actorUserId: request.userId,
          targetUserId: request.userId,
        },
      );
    }

    const fakeMeal = FakeMeal.create({
      id: this.idGenerator.generateId(),
      userId: request.userId,
      name: request.name,
      calories: request.calories,
      protein: request.protein,
    });

    dayToAddFakeMeal.addFakeMeal(fakeMeal.id);

    await this.transactionContext.run(async () => {
      await this.fakeMealsRepo.saveFakeMeal(fakeMeal);
      await this.daysRepo.saveDay(dayToAddFakeMeal);
    });

    return toDayDTO(dayToAddFakeMeal);
  }
}
