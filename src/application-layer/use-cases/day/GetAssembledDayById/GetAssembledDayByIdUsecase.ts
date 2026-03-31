import {
  AssembledDayDTO,
  toAssembledDayDTO,
} from "@/application-layer/dtos/AssembledDayDTO";
import { toDayDTO } from "@/application-layer/dtos/DayDTO";
import {
  FakeMealDTO,
  toFakeMealDTO,
} from "@/application-layer/dtos/FakeMealDTO";
import { MealDTO, toMealDTO } from "@/application-layer/dtos/MealDTO";
import { NotFoundError } from "@/domain/common/errors";
import { FakeMeal } from "@/domain/entities/fakemeal/FakeMeal";
import { Meal } from "@/domain/entities/meal/Meal";
import { DaysRepo } from "@/domain/repos/DaysRepo.port";
import { FakeMealsRepo } from "@/domain/repos/FakeMealsRepo.port";
import { MealsRepo } from "@/domain/repos/MealsRepo.port";
import { UsersRepo } from "@/domain/repos/UsersRepo.port";

export type GetAssembledDayByIdUsecaseRequest = {
  dayId: string;
  userId: string;
};

export class GetAssembledDayByIdUsecase {
  constructor(
    private dayRepo: DaysRepo,
    private mealsRepo: MealsRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: GetAssembledDayByIdUsecaseRequest,
  ): Promise<AssembledDayDTO | null> {
    const [user, day] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.dayRepo.getDayByIdAndUserId(request.dayId, request.userId),
    ]);

    if (!user) {
      throw new NotFoundError(
        `GetAssembledDayByIdUsecase: User with id ${request.userId} not found`,
      );
    }

    if (!day) {
      return null;
    }

    const dayDTO = toDayDTO(day);

    const promises = [
      this.mealsRepo.getMealByIds(day.mealIds),
      this.fakeMealsRepo.getFakeMealByIds(day.fakeMealIds),
    ] as const;

    const [meals, fakeMeals]: [Meal[], FakeMeal[]] =
      await Promise.all(promises);

    const mealsDTOS: MealDTO[] = meals.map(toMealDTO);
    const fakeMealsDTOS: FakeMealDTO[] = fakeMeals.map(toFakeMealDTO);

    const assembledDay = toAssembledDayDTO({
      ...dayDTO,
      meals: mealsDTOS,
      fakeMeals: fakeMealsDTOS,
    });

    return assembledDay;
  }
}
