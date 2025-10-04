import { describe, it, expect, beforeEach } from 'vitest';
import { GetFakeMealByIdUsecase } from '../GetFakeMealById.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError } from '@/domain/common/errors';

describe('GetFakeMealByIdUsecase', () => {
  let usecase: GetFakeMealByIdUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new GetFakeMealByIdUsecase(fakeMealsRepo);
  });

  it('should return fake meal when found', async () => {
    const fakeMeal = FakeMeal.create({
      id: 'test-id',
      name: 'Test Fake Meal',
      calories: 500,
      protein: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({ id: 'test-id' });

    expect(result).toBeDefined();
    expect(result?.id).toBe('test-id');
    expect(result?.name).toBe('Test Fake Meal');
    expect(result?.calories).toBe(500);
    expect(result?.protein).toBe(30);
  });

  it('should return null when fake meal not found', async () => {
    const result = await usecase.execute({ id: 'non-existent-id' });

    expect(result).toBeNull();
  });

  it('should throw ValidationError for invalid id', async () => {
    const invalidIds = ['', '   ', null, 2, {}, []];
    for (const id of invalidIds) {
      // @ts-expect-error testing invalid types
      await expect(usecase.execute({ id })).rejects.toThrow(ValidationError);
    }
  });
});
