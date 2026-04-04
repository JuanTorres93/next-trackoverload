import { AssembledDayDTO } from "@/application-layer/dtos/AssembledDayDTO";
import { DayDTO } from "@/application-layer/dtos/DayDTO";
import { AddMultipleMealsToDayUsecaseRequest } from "@/application-layer/use-cases/day/AddMultipleMealsToDay/AddMultipleMealsToDay.usecase";
import { CreateDayUsecaseRequest } from "@/application-layer/use-cases/day/CreateDay/CreateDay.usecase";
import { FakeMealCreateProps } from "@/domain/entities/fakemeal/FakeMeal";
import { UserCreateProps } from "@/domain/entities/user/User";
import { MemoryDaysRepo } from "@/infra/repos/memory/MemoryDaysRepo";
import { MemoryFakeMealsRepo } from "@/infra/repos/memory/MemoryFakeMealsRepo";
import { MemoryMealsRepo } from "@/infra/repos/memory/MemoryMealsRepo";
import { AppDaysRepo } from "@/interface-adapters/app/repos/AppDaysRepo";
import { AppFakeMealsRepo } from "@/interface-adapters/app/repos/AppFakeMealsRepo";
import { AppMealsRepo } from "@/interface-adapters/app/repos/AppMealsRepo";
import {
  AppAddFakeMealToDayUsecase,
  AppCreateDayUsecase,
  AppGetAssembledDayById,
} from "@/interface-adapters/app/use-cases/day";
import { AppAddMultipleMealsToDayUsecase } from "@/interface-adapters/app/use-cases/day";
import { AppUpdateUserWeightForDayUsecase } from "@/interface-adapters/app/use-cases/day";

import { createMockRecipes } from "./recipes";
import { createMockUser } from "./user";

const daysRepo = AppDaysRepo as MemoryDaysRepo;
const mealsRepo = AppMealsRepo as MemoryMealsRepo;
const fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;

type CreateMockDayOptions = {
  alternativeUserProps?: Partial<UserCreateProps>;
  createWithMeal?: boolean;
  fakeMeals?: Partial<FakeMealCreateProps>;
  returnAssembled?: boolean;
};

export async function createMockDay(
  day: number,
  month: number,
  year: number,
  options: CreateMockDayOptions & { returnAssembled: true },
): Promise<AssembledDayDTO>;
export async function createMockDay(
  day?: number,
  month?: number,
  year?: number,
  options?: CreateMockDayOptions & { returnAssembled?: false },
): Promise<DayDTO>;
export async function createMockDay(
  day = 1,
  month = 1,
  year = 2000,
  {
    alternativeUserProps,
    createWithMeal = false,
    fakeMeals,
    returnAssembled = false,
  }: CreateMockDayOptions = {},
): Promise<DayDTO | AssembledDayDTO> {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("createMockDay should only be used in tests");
  }

  const mockUser = await createMockUser(alternativeUserProps);

  const dayPropsForUseCase: CreateDayUsecaseRequest = {
    actorUserId: mockUser.id,
    targetUserId: mockUser.id,
    day,
    month,
    year,
  };

  const createdDay = await AppCreateDayUsecase.execute(dayPropsForUseCase);

  if (createWithMeal) {
    const mockRecipes = await createMockRecipes();
    const recipeIdToAdd = mockRecipes.mockRecipes[0].id;

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
    daysRepo.clearForTesting();
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

export async function createMultipleMockDaysWithWeights(
  numberOfDays: number,
): Promise<DayDTO[]> {
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "createMultipleMockDaysWithWeights should only be used in tests",
    );
  }

  const mockUser = await createMockUser();

  const createdDays: DayDTO[] = [];

  for (let i = 0; i < numberOfDays; i++) {
    const day = i + 1;
    const month = 1;
    const year = 2000;

    const createdDay = await createMockDay(day, month, year);

    const weightForDay = 70 + i; // Just an example weight that changes each day

    const dayWithWeight = await AppUpdateUserWeightForDayUsecase.execute({
      dayId: createdDay.id,
      userId: mockUser.id,
      newWeightInKg: weightForDay,
    });

    createdDays.push(dayWithWeight);
  }

  afterAll(() => {
    daysRepo.clearForTesting();
  });

  return createdDays;
}
