import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { stringDayIdToDate } from '@/domain/value-objects/DayId/DayId';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { Meal } from '@/domain/entities/meal/Meal';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { NotFoundError } from '@/domain/common/errors';

export type CreateDayUsecaseRequest = {
  date: string;
  userId: string;
  meals?: (Meal | FakeMeal)[];
};

export class CreateDayUsecase {
  constructor(private daysRepo: DaysRepo, private usersRepo: UsersRepo) {}

  async execute(request: CreateDayUsecaseRequest): Promise<DayDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `CreateDayUsecase: user with id ${request.userId} not found`
      );
    }

    const newDay = Day.create({
      id: stringDayIdToDate(request.date),
      userId: request.userId,
      meals: request.meals || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.daysRepo.saveDay(newDay);

    return toDayDTO(newDay);
  }
}
