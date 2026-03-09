import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';

import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';

import { AssembledDayDTO, DayDTO } from '@/application-layer/dtos/DayDTO';

import {
  AppCreateDayUsecase,
  AppGetAssembledDayById,
} from '@/interface-adapters/app/use-cases/day';

import { CreateDayUsecaseRequest } from '@/application-layer/use-cases/day/CreateDay/CreateDay.usecase';

import { AddMultipleMealsToDayUsecaseRequest } from '@/application-layer/use-cases/day/AddMultipleMealsToDay/AddMultipleMealsToDay.usecase';
import { AppAddMultipleMealsToDayUsecase } from '@/interface-adapters/app/use-cases/day';

import { createMockRecipes } from './recipes';
import { createMockUser } from './user';

const daysRepo = AppDaysRepo as MemoryDaysRepo;
const mealsRepo = AppMealsRepo as MemoryMealsRepo;

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
