import { describe, it, expect, beforeEach } from 'vitest';
import { CreateFakeMealUsecase } from '../CreateFakeMeal.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('CreateFakeMealUsecase', () => {
  let usecase: CreateFakeMealUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new CreateFakeMealUsecase(fakeMealsRepo);
  });

  it('should create a fake meal successfully', async () => {
    const request = {
      userId: vp.userId,
      name: vp.validFakeMealProps.name,
      calories: vp.validFakeMealProps.calories,
      protein: vp.validFakeMealProps.protein,
    };

    const result = await usecase.execute(request);

    expect(result.userId).toBe(request.userId);
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
    expect(savedFakeMeal?.userId).toBe(request.userId);
  });

  it('should throw ValidationError for empty name', async () => {
    const request = {
      userId: vp.userId,
      name: '',
      calories: vp.validFakeMealProps.calories,
      protein: vp.validFakeMealProps.protein,
    };

    await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for zero calories', async () => {
    const request = {
      userId: vp.userId,
      name: vp.validFakeMealProps.name,
      calories: 0,
      protein: vp.validFakeMealProps.protein,
    };

    await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for negative protein', async () => {
    const request = {
      userId: vp.userId,
      name: vp.validFakeMealProps.name,
      calories: vp.validFakeMealProps.calories,
      protein: -10,
    };

    await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid userId', async () => {
    const invalidUserIds = ['', '   ', null, undefined, 34, 0, -5, {}, []];
    for (const userId of invalidUserIds) {
      const request = {
        userId,
        name: vp.validFakeMealProps.name,
        calories: vp.validFakeMealProps.calories,
        protein: vp.validFakeMealProps.protein,
      };

      // @ts-expect-error testing invalid types
      await expect(usecase.execute(request)).rejects.toThrow(ValidationError);
    }
  });
});
