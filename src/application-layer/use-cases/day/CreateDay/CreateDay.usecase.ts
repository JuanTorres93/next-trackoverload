import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { Meal } from '@/domain/entities/meal/Meal';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';

export type CreateDayUsecaseRequest = {
  date: Date;
  userId: string;
  meals?: (Meal | FakeMeal)[];
};

export class CreateDayUsecase {
  constructor(private daysRepo: DaysRepo) {}

  async execute(request: CreateDayUsecaseRequest): Promise<DayDTO> {
    // NOTE: id, userId and meals are validated in the entity
    const newDay = Day.create({
      id: request.date,
      userId: request.userId,
      meals: request.meals || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.daysRepo.saveDay(newDay);

    return toDayDTO(newDay);
  }
}
