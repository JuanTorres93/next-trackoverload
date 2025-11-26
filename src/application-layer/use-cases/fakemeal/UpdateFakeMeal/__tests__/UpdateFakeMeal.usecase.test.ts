import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateFakeMealUsecase } from '../UpdateFakeMeal.usecase';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { Id } from '@/domain/types/Id/Id';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('UpdateFakeMealUsecase', () => {
  let usecase: UpdateFakeMealUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;

  beforeEach(() => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usecase = new UpdateFakeMealUsecase(fakeMealsRepo);
  });

  it('should update fake meal name successfully', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: Id.create('test-id'),
      name: 'Original Name',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: 'test-id',
      userId: vp.userId,
      patch: { name: 'Updated Name' },
    });

    expect(result.name).toBe('Updated Name');
    expect(result.calories).toBe(200);
    expect(result.protein).toBe(30);
  });

  it('should return FakeMealDTO', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: Id.create('test-id'),
      name: 'Original Name',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: 'test-id',
      userId: vp.userId,
      patch: { name: 'Updated Name' },
    });

    expect(result).not.toBeInstanceOf(FakeMeal);
    for (const prop of dto.fakeMealDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
    expect(result.id).toBe('test-id');
    expect(result.userId).toBe(vp.userId);
    expect(result.name).toBe('Updated Name');
    expect(result.calories).toBe(vp.validFakeMealProps.calories);
    expect(result.protein).toBe(vp.validFakeMealProps.protein);
  });

  it('should update fake meal calories successfully', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: Id.create('test-id'),
      name: 'Test Meal',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: 'test-id',
      userId: vp.userId,
      patch: { calories: 600 },
    });

    expect(result.name).toBe('Test Meal');
    expect(result.calories).toBe(600);
    expect(result.protein).toBe(30);
  });

  it('should update fake meal protein successfully', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: Id.create('test-id'),
      name: 'Test Meal',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: 'test-id',
      userId: vp.userId,
      patch: { protein: 40 },
    });

    expect(result.name).toBe('Test Meal');
    expect(result.calories).toBe(200);
    expect(result.protein).toBe(40);
  });

  it('should update multiple fields at once', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: Id.create('test-id'),
      name: 'Original Name',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    const result = await usecase.execute({
      id: 'test-id',
      userId: vp.userId,
      patch: {
        name: 'Updated Name',
        calories: 600,
        protein: 40,
      },
    });

    expect(result.name).toBe('Updated Name');
    expect(result.calories).toBe(600);
    expect(result.protein).toBe(40);
  });

  it('should throw NotFoundError when fake meal does not exist', async () => {
    await expect(
      usecase.execute({
        id: 'non-existent-id',
        userId: vp.userId,
        patch: { name: 'Updated Name' },
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError for empty id', async () => {
    await expect(
      usecase.execute({
        id: '',
        userId: vp.userId,
        patch: { name: 'Updated Name' },
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid name in patch', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: Id.create('test-id'),
      name: 'Test Meal',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    await expect(
      usecase.execute({
        id: 'test-id',
        userId: vp.userId,
        patch: { name: '' },
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError for invalid calories in patch', async () => {
    const fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: Id.create('test-id'),
      name: 'Test Meal',
    });

    await fakeMealsRepo.saveFakeMeal(fakeMeal);

    await expect(
      usecase.execute({
        id: 'test-id',
        userId: vp.userId,
        patch: { calories: 0 },
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error for invalid userId', async () => {
    const invalidUserIds = ['', '   ', null, undefined, 34, 0, -5, {}, []];
    for (const userId of invalidUserIds) {
      await expect(
        // @ts-expect-error testing invalid types
        usecase.execute({ id: 'test-id', userId, patch: { name: 'Name' } })
      ).rejects.toThrow(ValidationError);
    }
  });
});
