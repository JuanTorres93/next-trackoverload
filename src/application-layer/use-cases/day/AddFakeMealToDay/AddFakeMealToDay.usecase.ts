import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { dayIdToDayMonthYear } from '@/domain/value-objects/DayId/DayId';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

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
    private idGenerator: IdGenerator
  ) {}

  async execute(request: AddFakeMealToDayUsecaseRequest): Promise<DayDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `AddFakeMealToDayUsecase: User with id ${request.userId} not found`
      );
    }

    let day = await this.daysRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId
    );

    if (!day) {
      day = Day.create({
        ...dayIdToDayMonthYear(request.dayId),
        userId: request.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const fakeMeal = FakeMeal.create({
      id: this.idGenerator.generateId(),
      userId: request.userId,
      name: request.name,
      calories: request.calories,
      protein: request.protein,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    day.addFakeMeal(fakeMeal.id);
    await this.fakeMealsRepo.saveFakeMeal(fakeMeal);
    await this.daysRepo.saveDay(day);

    return toDayDTO(day);
  }
}
