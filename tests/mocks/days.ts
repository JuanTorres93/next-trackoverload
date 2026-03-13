import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';

import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';

import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';

import { AssembledDayDTO, DayDTO } from '@/application-layer/dtos/DayDTO';

import {
  AppAddFakeMealToDayUsecase,
  AppCreateDayUsecase,
  AppGetAssembledDayById,
} from '@/interface-adapters/app/use-cases/day';

import { CreateDayUsecaseRequest } from '@/application-layer/use-cases/day/CreateDay/CreateDay.usecase';

import { AddMultipleMealsToDayUsecaseRequest } from '@/application-layer/use-cases/day/AddMultipleMealsToDay/AddMultipleMealsToDay.usecase';
import { AppAddMultipleMealsToDayUsecase } from '@/interface-adapters/app/use-cases/day';
import { AppUpdateUserWeightForDayUsecase } from '@/interface-adapters/app/use-cases/day';

import { createMockRecipes } from './recipes';
import { createMockUser } from './user';

const daysRepo = AppDaysRepo as MemoryDaysRepo;
const mealsRepo = AppMealsRepo as MemoryMealsRepo;
const fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;

export async function createMockDay(
  day = 1,
  month = 1,
  year = 2000,
): Promise<DayDTO> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('createMockDay should only be used in tests');
  }

  const mockUser = await createMockUser();

  const dayPropsForUseCase: CreateDayUsecaseRequest = {
    actorUserId: mockUser.id,
    targetUserId: mockUser.id,
    day,
    month,
    year,
  };

  const createdDay = await AppCreateDayUsecase.execute(dayPropsForUseCase);

  afterAll(() => {
    daysRepo.clearForTesting();
  });

  return createdDay;
}

export async function createMockDayWithMeal(
  day = 1,
  month = 1,
  year = 2000,
): Promise<AssembledDayDTO> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('createMockDayWithMeal should only be used in tests');
  }

  const mockDay = await createMockDay(day, month, year);
  const mockRecipes = await createMockRecipes();

  const recipeIdToAdd = mockRecipes.mockRecipes[0].id;

  const addMealsToDayProps: AddMultipleMealsToDayUsecaseRequest = {
    dayId: mockDay.id,
    userId: mockDay.userId,
    recipeIds: [recipeIdToAdd],
  };

  await AppAddMultipleMealsToDayUsecase.execute(addMealsToDayProps);

  const mockDayWithMeal = await AppGetAssembledDayById.execute({
    dayId: mockDay.id,
    userId: mockDay.userId,
  });

  afterAll(() => {
    daysRepo.clearForTesting();
    mealsRepo.clearForTesting();
  });

  return mockDayWithMeal!;
}

export async function createMultipleMockDaysWithWeights(
  numberOfDays: number,
): Promise<DayDTO[]> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error(
      'createMultipleMockDaysWithWeights should only be used in tests',
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

export async function createMockDayWithFakeMeal(
  day = 1,
  month = 1,
  year = 2000,
): Promise<AssembledDayDTO> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('createMockDayWithFakeMeal should only be used in tests');
  }

  const mockDay = await createMockDay(day, month, year);

  await AppAddFakeMealToDayUsecase.execute({
    dayId: mockDay.id,
    userId: mockDay.userId,
    name: 'Test Fake Meal',
    calories: 400,
    protein: 25,
  });

  const mockDayWithFakeMeal = await AppGetAssembledDayById.execute({
    dayId: mockDay.id,
    userId: mockDay.userId,
  });

  afterAll(() => {
    daysRepo.clearForTesting();
    fakeMealsRepo.clearForTesting();
  });

  return mockDayWithFakeMeal!;
}
