import { AssembledDayDTO } from "../../src/application-layer/dtos/AssembledDayDTO";
import { DayDTO } from "../../src/application-layer/dtos/DayDTO";
import { AddMultipleMealsToDayUsecaseRequest } from "../../src/application-layer/use-cases/day/AddMultipleMealsToDay/AddMultipleMealsToDay.usecase";
import { CreateDayUsecaseRequest } from "../../src/application-layer/use-cases/day/CreateDay/CreateDay.usecase";
import { FakeMealCreateProps } from "../../src/domain/entities/fakemeal/FakeMeal";
import { UserCreateProps } from "../../src/domain/entities/user/User";
import {
  AppAddFakeMealToDayUsecase,
  AppAddMultipleMealsToDayUsecase,
  AppCreateDayUsecase,
  AppGetAssembledDayById,
  AppUpdateUserWeightForDayUsecase,
} from "../../src/interface-adapters/app/use-cases/day";
import { TestDaysRepo } from "../repos/TestDaysRepo";
import { createAndPersistTest_Recipes_Ingredients_User } from "./recipes";
import { createAndPersistTestUser } from "./user";

type CreateMockDayOptions = {
  alternativeUserProps?: Partial<UserCreateProps>;
  createWithMeal?: boolean;
  mealRecipeId?: string;
  fakeMeals?: Partial<FakeMealCreateProps>;
  returnAssembled?: boolean;
};

export async function createAndPersistTestDay(
  day: number,
  month: number,
  year: number,

  options: CreateMockDayOptions & { returnAssembled: true },
): Promise<AssembledDayDTO>;
export async function createAndPersistTestDay(
  day?: number,
  month?: number,
  year?: number,

  options?: CreateMockDayOptions & { returnAssembled?: false },
): Promise<DayDTO>;
export async function createAndPersistTestDay(
  day = 1,
  month = 1,
  year = 2000,

  {
    alternativeUserProps,
    createWithMeal = false,
    mealRecipeId,
    fakeMeals,
    returnAssembled = false,
  }: CreateMockDayOptions = {},
): Promise<DayDTO | AssembledDayDTO> {
  const mockUser = await createAndPersistTestUser(alternativeUserProps);

  const dayPropsForUseCase: CreateDayUsecaseRequest = {
    actorUserId: mockUser.id,
    targetUserId: mockUser.id,
    day,
    month,
    year,
  };

  const createdDay = await AppCreateDayUsecase.execute(dayPropsForUseCase);

  if (createWithMeal) {
    const recipeIdToAdd =
      mealRecipeId ??
      (await createAndPersistTest_Recipes_Ingredients_User()).mockRecipes[0].id;

    const addMealsToDayProps: AddMultipleMealsToDayUsecaseRequest = {
      dayId: createdDay.id,
      userId: mockUser.id,
      recipeIds: [recipeIdToAdd],
    };

    await AppAddMultipleMealsToDayUsecase.execute(addMealsToDayProps);
  }

  if (fakeMeals) {
    await AppAddFakeMealToDayUsecase.execute({
      dayId: createdDay.id,
      userId: mockUser.id,
      name: fakeMeals.name || "Test Fake Meal",
      calories: fakeMeals.calories || 400,
      protein: fakeMeals.protein || 25,
    });
  }

  afterAll(() => {
    TestDaysRepo.clearForTesting();
  });

  if (returnAssembled) {
    const assembledDay = await AppGetAssembledDayById.execute({
      dayId: createdDay.id,
      userId: createdDay.userId,
    });
    return assembledDay!;
  }

  return createdDay;
}

export async function createAndPersistMultipleTestDaysWithWeights(
  numberOfDays: number,
): Promise<DayDTO[]> {
  const mockUser = await createAndPersistTestUser();

  const createdDays: DayDTO[] = [];

  for (let i = 0; i < numberOfDays; i++) {
    const day = i + 1;
    const month = 1;
    const year = 2000;

    const createdDay = await createAndPersistTestDay(day, month, year);

    const weightForDay = 70 + i; // Just an example weight that changes each day

    const dayWithWeight = await AppUpdateUserWeightForDayUsecase.execute({
      dayId: createdDay.id,
      userId: mockUser.id,
      newWeightInKg: weightForDay,
    });

    createdDays.push(dayWithWeight);
  }

  afterAll(() => {
    TestDaysRepo.clearForTesting();
  });

  return createdDays;
}
