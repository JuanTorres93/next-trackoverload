import { describe, it, expect, beforeEach } from 'vitest';
import { GetAllFakeMealsUsecase } from '../GetAllFakeMeals.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';

describe('GetAllFakeMealsUsecase', () => {
  let usecase: GetAllFakeMealsUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new GetAllFakeMealsUsecase(fakeMealsRepo);
  });

  it('should return empty array when no fake meals exist', async () => {
    const result = await usecase.execute();

    expect(result).toEqual([]);
  });

  it('should return all fake meals', async () => {
    const fakeMeal1 = FakeMeal.create({
      id: 'test-id-1',
      name: 'Test Fake Meal 1',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const fakeMeal2 = FakeMeal.create({
      id: 'test-id-2',
      name: 'Test Fake Meal 2',
      calories: 300,
      protein: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal1);
    await fakeMealsRepo.saveFakeMeal(fakeMeal2);

    const result = await usecase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Test Fake Meal 1');
    expect(result[1].name).toBe('Test Fake Meal 2');
  });
});
