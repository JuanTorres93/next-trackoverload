import { describe, it, expect, beforeEach } from 'vitest';
import { CreateFakeMealUsecase } from '../CreateFakeMeal.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { ValidationError } from '@/domain/common/errors';

describe('CreateFakeMealUsecase', () => {
  let usecase: CreateFakeMealUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new CreateFakeMealUsecase(fakeMealsRepo);
  });

  it('should create a fake meal successfully', async () => {
    const request = {
      name: 'Test Fake Meal',
      calories: 500,
      protein: 30,
    };

    const result = await usecase.execute(request);

    expect(result.name).toBe(request.name);
    expect(result.calories).toBe(request.calories);
    expect(result.protein).toBe(request.protein);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);

    // Verify it was saved in the repository
    const savedFakeMeal = await fakeMealsRepo.getFakeMealById(result.id);
    expect(savedFakeMeal).toBeDefined();
    expect(savedFakeMeal?.name).toBe(request.name);
  });

  it('should throw ValidationError for empty name', async () => {
    const request = {
      name: '',
      calories: 500,
      protein: 30,
    };

    await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for zero calories', async () => {
    const request = {
      name: 'Test Fake Meal',
      calories: 0,
      protein: 30,
    };

    await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for negative protein', async () => {
    const request = {
      name: 'Test Fake Meal',
      calories: 500,
      protein: -10,
    };

    await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
  });
});
