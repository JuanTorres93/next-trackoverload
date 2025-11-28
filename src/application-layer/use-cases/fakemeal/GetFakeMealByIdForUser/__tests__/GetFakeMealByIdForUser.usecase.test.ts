import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { ValidationError } from '@/domain/common/errors';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetFakeMealByIdForUserUsecase } from '../GetFakeMealByIdForUser.usecase';

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
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: vp.validFakeMealProps.id,
      userId: vp.userId,
    });

    expect(result).toBeDefined();
    expect(result?.id).toBe(vp.validFakeMealProps.id);
    expect(result?.userId).toBe(vp.userId);
    expect(result?.name).toBe(vp.validFakeMealProps.name);
    expect(result?.calories).toBe(vp.validFakeMealProps.calories);
    expect(result?.protein).toBe(vp.validFakeMealProps.protein);
  });

  it('should return array of FakeMealDTO', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: vp.validFakeMealProps.id,
      userId: vp.userId,
    });

    expect(result).not.toBeInstanceOf(FakeMeal);
    for (const prop of dto.fakeMealDTOProperties) {
      expect(result).toHaveProperty(prop);
    }

    expect(result!.id).toBe(vp.validFakeMealProps.id);
    expect(result!.userId).toBe(vp.userId);
    expect(result!.name).toBe(vp.validFakeMealProps.name);
    expect(result!.calories).toBe(vp.validFakeMealProps.calories);
    expect(result!.protein).toBe(vp.validFakeMealProps.protein);
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
      userId: 'user-2',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: vp.validFakeMealProps.id,
      userId: vp.userId,
    });

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
