import { AssembledDayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import {
  FakeMealDTO,
  toFakeMealDTO,
} from '@/application-layer/dtos/FakeMealDTO';
import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetAssembledDayByIdUsecaseRequest = {
  dayId: string;
  userId: string;
};

export class GetAssembledDayByIdUsecase {
  constructor(
    private dayRepo: DaysRepo,
    private mealsRepo: MealsRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private usersRepo: UsersRepo
  ) {}

  async execute(
    request: GetAssembledDayByIdUsecaseRequest
  ): Promise<AssembledDayDTO | null> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetAssembledDayByIdUsecase: User with id ${request.userId} not found`
      );
    }

    const day = await this.dayRepo.getDayByIdAndUserId(
      request.dayId,
      request.userId
    );
    if (!day) {
      throw new NotFoundError(
        `GetAssembledDayByIdUsecase: Day with id ${request.dayId} not found`
      );
    }

    const dayDTO = toDayDTO(day);

    const mealsDTOS: MealDTO[] = (
      await this.mealsRepo.getMealByIds(day.mealIds)
    ).map(toMealDTO);

    const fakeMealsDTOS: FakeMealDTO[] = (
      await this.fakeMealsRepo.getFakeMealByIds(day.fakeMealIds)
    ).map(toFakeMealDTO);

    const assembledDay: AssembledDayDTO = {
      ...dayDTO,
      meals: mealsDTOS,
      fakeMeals: fakeMealsDTOS,
    };

    return assembledDay;
  }
}
