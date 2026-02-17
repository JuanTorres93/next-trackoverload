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

export type GetMultipleAssembledDaysByIdsUsecaseRequest = {
  dayIds: string[];
  userId: string;
};

export class GetMultipleAssembledDaysByIdsUsecase {
  constructor(
    private dayRepo: DaysRepo,
    private mealsRepo: MealsRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: GetMultipleAssembledDaysByIdsUsecaseRequest,
  ): Promise<AssembledDayDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetMultipleAssembledDaysByIdsUsecase: User with id ${request.userId} not found`,
      );
    }

    // Get all days in one query
    const days = await this.dayRepo.getMultipleDaysByIdsAndUserId(
      request.dayIds,
      request.userId,
    );

    if (days.length === 0) {
      return [];
    }

    // Collect all unique mealIds and fakeMealIds from all days
    const allMealIds = new Set<string>();
    const allFakeMealIds = new Set<string>();

    days.forEach((day) => {
      day.mealIds.forEach((mealId) => allMealIds.add(mealId));
      day.fakeMealIds.forEach((fakeMealId) => allFakeMealIds.add(fakeMealId));
    });

    // Fetch all meals and fake meals in one query each
    const meals = await this.mealsRepo.getMealByIds([...allMealIds]);
    const fakeMeals = await this.fakeMealsRepo.getFakeMealByIds([
      ...allFakeMealIds,
    ]);

    // Map to DTOs
    const mealDTOs = new Map<string, MealDTO>();

    meals.forEach((meal) => {
      mealDTOs.set(meal.id, toMealDTO(meal));
    });

    const fakeMealDTOs = new Map<string, FakeMealDTO>();
    fakeMeals.forEach((fakeMeal) => {
      fakeMealDTOs.set(fakeMeal.id, toFakeMealDTO(fakeMeal));
    });

    // Assemble each day with its corresponding meals and fake meals
    const assembledDays: AssembledDayDTO[] = days.map((day) => {
      const dayDTO = toDayDTO(day);

      const dayMeals = day.mealIds.map((mealId) =>
        mealDTOs.get(mealId),
      ) as MealDTO[];

      const dayFakeMeals = day.fakeMealIds.map((fakeMealId) =>
        fakeMealDTOs.get(fakeMealId),
      ) as FakeMealDTO[];

      return {
        ...dayDTO,
        meals: dayMeals,
        fakeMeals: dayFakeMeals,
      };
    });

    return assembledDays;
  }
}
