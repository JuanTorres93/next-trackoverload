import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateFakeMealUsecase } from '../CreateFakeMeal.usecase';

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
    expect(result.createdAt).toBeTypeOf('string');
    expect(result.updatedAt).toBeTypeOf('string');

    // Verify it was saved in the repository
    const savedFakeMeal = await fakeMealsRepo.getFakeMealById(result.id);
    expect(savedFakeMeal).toBeDefined();
    expect(savedFakeMeal?.name).toBe(request.name);
    expect(savedFakeMeal?.userId).toBe(request.userId);
  });

  it('should return FakeMealDTO', async () => {
    const request = {
      userId: vp.userId,
      name: vp.validFakeMealProps.name,
      calories: vp.validFakeMealProps.calories,
      protein: vp.validFakeMealProps.protein,
    };

    const result = await usecase.execute(request);

    expect(result).not.toBeInstanceOf(FakeMeal);
    for (const prop of dto.fakeMealDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
    expect(result.id).toBeDefined();
    expect(result.userId).toBe(request.userId);
    expect(result.name).toBe(request.name);
    expect(result.calories).toBe(request.calories);
    expect(result.protein).toBe(request.protein);
  });
});
