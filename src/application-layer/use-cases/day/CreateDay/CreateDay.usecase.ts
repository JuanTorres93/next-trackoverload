import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Meal } from '@/domain/entities/meal/Meal';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type CreateDayUsecaseRequest = {
  day: number;
  month: number;
  year: number;
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
      day: request.day,
      month: request.month,
      year: request.year,
      userId: request.userId,
      meals: request.meals || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.daysRepo.saveDay(newDay);

    return toDayDTO(newDay);
  }
}
