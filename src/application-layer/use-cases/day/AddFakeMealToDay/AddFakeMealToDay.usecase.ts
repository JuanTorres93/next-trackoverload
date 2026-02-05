import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { UnitOfWork } from '@/application-layer/unit-of-work/UnitOfWork.port';

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
    private unitOfWork: UnitOfWork,
  ) {}

  async execute(request: AddFakeMealToDayUsecaseRequest): Promise<DayDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `AddFakeMealToDayUsecase: User with id ${request.userId} not found`,
      );
    }

    const day = await this.daysRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId,
    );

    if (!day)
      throw new NotFoundError(
        `AddFakeMealToDayUsecase: Day with id ${request.dayId} for user with id ${request.userId} not found`,
      );

    const fakeMeal = FakeMeal.create({
      id: this.idGenerator.generateId(),
      userId: request.userId,
      name: request.name,
      calories: request.calories,
      protein: request.protein,
    });

    day.addFakeMeal(fakeMeal.id);

    await this.unitOfWork.inTransaction(async () => {
      await this.fakeMealsRepo.saveFakeMeal(fakeMeal);
      await this.daysRepo.saveDay(day);
    });

    return toDayDTO(day);
  }
}
