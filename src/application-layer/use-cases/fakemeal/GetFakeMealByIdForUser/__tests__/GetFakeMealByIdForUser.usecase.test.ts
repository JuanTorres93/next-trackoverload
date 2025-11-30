import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { User } from '@/domain/entities/user/User';
import { NotFoundError } from '@/domain/common/errors';
import { MemoryFakeMealsRepo } from '@/infra/memory/MemoryFakeMealsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetFakeMealByIdForUserUsecase } from '../GetFakeMealByIdForUser.usecase';

describe('GetFakeMealByIdUsecase', () => {
  let usecase: GetFakeMealByIdForUserUsecase;
  let fakeMealsRepo: MemoryFakeMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let user: User;

  beforeEach(async () => {
    fakeMealsRepo = new MemoryFakeMealsRepo();
    usersRepo = new MemoryUsersRepo();
    usecase = new GetFakeMealByIdForUserUsecase(fakeMealsRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);
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

  it('should throw error if user does not exist', async () => {
    await expect(
      usecase.execute({
        id: vp.validFakeMealProps.id,
        userId: 'non-existent',
      })
    ).rejects.toThrow(NotFoundError);
    await expect(
      usecase.execute({
        id: vp.validFakeMealProps.id,
        userId: 'non-existent',
      })
    ).rejects.toThrow(/GetFakeMealByIdForUserUsecase.*user.*not.*found/);
  });
});
