import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { Day } from '@/domain/entities/day/Day';
import { ValidationError } from '@/domain/common/errors';
import {
  validateDate,
  validateNonEmptyString,
} from '@/domain/common/validation';
import { toDayDTO, DayDTO } from '@/application-layer/dtos/DayDTO';

export type AddFakeMealToDayUsecaseRequest = {
  date: Date;
  userId: string;
  fakeMealId: string;
};

export class AddFakeMealToDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private fakeMealsRepo: FakeMealsRepo
  ) {}

  async execute(request: AddFakeMealToDayUsecaseRequest): Promise<DayDTO> {
    validateDate(request.date, 'AddFakeMealToDayUsecase: date');
    validateNonEmptyString(request.userId, 'AddFakeMealToDayUsecase: userId');
    validateNonEmptyString(
      request.fakeMealId,
      'AddFakeMealToDayUsecase: fakeMealId'
    );

    const fakeMeal = await this.fakeMealsRepo.getFakeMealByIdAndUserId(
      request.fakeMealId,
      request.userId
    );
    if (!fakeMeal) {
      throw new ValidationError(
        `AddFakeMealToDayUsecase: FakeMeal with id ${request.fakeMealId} and userId ${request.userId} not found`
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

    day.addMeal(fakeMeal);
    await this.daysRepo.saveDay(day);

    return toDayDTO(day);
  }
}
