import { describe, it, expect, beforeEach } from 'vitest';
import { GetFakeMealByIdForUserUsecase } from '../GetFakeMealByIdForUser.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('GetFakeMealByIdUsecase', () => {
  let usecase: GetFakeMealByIdForUserUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new GetFakeMealByIdForUserUsecase(fakeMealsRepo);
  });

  it('should return fake meal when found for correct user', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: 'test-id',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({ id: 'test-id', userId: vp.userId });

    expect(result).toBeDefined();
    expect(result?.id).toBe('test-id');
    expect(result?.userId).toBe(vp.userId);
    expect(result?.name).toBe(vp.validFakeMealProps.name);
    expect(result?.calories).toBe(vp.validFakeMealProps.calories);
    expect(result?.protein).toBe(vp.validFakeMealProps.protein);
  });

  it('should return null when fake meal not found', async () => {
    const result = await usecase.execute({
      id: 'non-existent-id',
      userId: vp.userId,
    });

    expect(result).toBeNull();
  });

  it('should return null when fake meal belongs to different user', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: 'test-id',
      userId: 'user-2',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({ id: 'test-id', userId: vp.userId });

    expect(result).toBeNull();
  });

  it('should throw ValidationError for invalid id', async () => {
    const invalidIds = ['', '   '];
    for (const id of invalidIds) {
      await expect(usecase.execute({ id, userId: vp.userId })).rejects.toThrow(
        ValidationError
      );
    }
  });

  it('should throw ValidationError for invalid userId', async () => {
    const invalidUserIds = ['', '   '];
    for (const userId of invalidUserIds) {
      await expect(
        usecase.execute({ id: vp.validFakeMealProps.id, userId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
