import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { ValidationError } from '@/domain/common/errors';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetFakeMealsByIdsForUserUsecase } from '../GetFakeMealsByIdsForUser.usecase';

describe('GetFakeMealsByIdsUsecase', () => {
  let usecase: GetFakeMealsByIdsForUserUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new GetFakeMealsByIdsForUserUsecase(fakeMealsRepo);
  });

  it('should return fake meals for valid ids', async () => {
    const fakeMeal1 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: 'test-id-1',
      name: 'Test Fake Meal 1',
    });

    const fakeMeal2 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: 'test-id-2',
      name: 'Test Fake Meal 2',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal1);
    await fakeMealsRepo.saveFakeMeal(fakeMeal2);

    const ids = ['test-id-1', 'test-id-2'];
    const result = await usecase.execute({ ids, userId: vp.userId });

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Test Fake Meal 1');
    expect(result[1].name).toBe('Test Fake Meal 2');
  });

  it('should return array of FakeMealDTO', async () => {
    const fakeMeal1 = FakeMeal.create({
      ...vp.validFakeMealProps,
      name: 'Test Fake Meal 1',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal1);

    const ids = [vp.validFakeMealProps.id];
    const result = await usecase.execute({ ids, userId: vp.userId });

    expect(result).toHaveLength(1);
    expect(result[0]).not.toBeInstanceOf(FakeMeal);
    for (const prop of dto.fakeMealDTOProperties) {
      expect(result[0]).toHaveProperty(prop);
    }
    expect(result[0].id).toBe(vp.validFakeMealProps.id);
    expect(result[0].name).toBe('Test Fake Meal 1');
    expect(result[0].userId).toBe(vp.userId);
    expect(result[0].calories).toBe(vp.validFakeMealProps.calories);
    expect(result[0].protein).toBe(vp.validFakeMealProps.protein);
  });

  it('should filter out non-existent fake meals', async () => {
    const fakeMeal1 = FakeMeal.create({
      ...vp.validFakeMealProps,
      name: 'Test Fake Meal 1',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal1);

    const ids = [vp.validFakeMealProps.id, 'non-existent-id'];
    const result = await usecase.execute({ ids, userId: vp.userId });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Fake Meal 1');
  });

  it('should return empty array when no fake meals found', async () => {
    const ids = ['non-existent-id-1', 'non-existent-id-2'];
    const result = await usecase.execute({ ids, userId: vp.userId });

    expect(result).toEqual([]);
  });

  it('should handle duplicate ids', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      name: 'Test Fake Meal',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const ids = [
      vp.validFakeMealProps.id,
      vp.validFakeMealProps.id,
      vp.validFakeMealProps.id,
    ];
    const result = await usecase.execute({ ids, userId: vp.userId });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Fake Meal');
  });

  it('should throw ValidationError for non-array ids', async () => {
    await expect(
      usecase.execute({
        ids: 'not-an-array' as unknown as string[],
        userId: vp.userId,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for empty array', async () => {
    await expect(
      usecase.execute({ ids: [], userId: vp.userId })
    ).rejects.toThrow(ValidationError);
  });
});
