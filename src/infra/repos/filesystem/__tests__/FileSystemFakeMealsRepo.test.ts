import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { FileSystemFakeMealsRepo } from '../FileSystemFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import * as fakeMealTestProps from '../../../../../tests/createProps/fakeMealTestProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import fs from 'fs/promises';

describe('FileSystemFakeMealsRepo', () => {
  let repo: FileSystemFakeMealsRepo;
  let fakeMeal: FakeMeal;
  const testDir = './__test_data__/fakemeals';

  beforeEach(async () => {
    repo = new FileSystemFakeMealsRepo(testDir);
    fakeMeal = FakeMeal.create(fakeMealTestProps.validFakeMealProps);
    await repo.saveFakeMeal(fakeMeal);
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  it('should save a fake meal', async () => {
    const newFakeMeal = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakemeal-2',
      name: 'Burger',
    });
    await repo.saveFakeMeal(newFakeMeal);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(2);
  });

  it('should retrieve a fake meal by ID', async () => {
    const fetchedFakeMeal = await repo.getFakeMealById(
      fakeMealTestProps.validFakeMealProps.id,
    );
    expect(fetchedFakeMeal).not.toBeNull();
    expect(fetchedFakeMeal?.name).toBe(
      fakeMealTestProps.validFakeMealProps.name,
    );
  });

  it('should retrieve multiple fake meals by IDs', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakemeal-2',
      name: 'Energy Bar',
    });
    const fakeMeal3 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakemeal-3',
      name: 'Protein Bar',
    });
    await repo.saveFakeMeal(fakeMeal2);
    await repo.saveFakeMeal(fakeMeal3);

    const fetchedFakeMeals = await repo.getFakeMealByIds([
      fakeMealTestProps.validFakeMealProps.id,
      'fakemeal-2',
    ]);
    expect(fetchedFakeMeals.length).toBe(2);
    expect(fetchedFakeMeals[0].name).toBe(
      fakeMealTestProps.validFakeMealProps.name,
    );
    expect(fetchedFakeMeals[1].name).toBe('Energy Bar');
  });

  it('should return empty array when no IDs match', async () => {
    const fetchedFakeMeals = await repo.getFakeMealByIds([
      'non-existent-1',
      'non-existent-2',
    ]);
    expect(fetchedFakeMeals.length).toBe(0);
  });

  it('should retrieve only existing fake meals when some IDs do not exist', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakemeal-2',
      name: 'Energy Bar',
    });
    await repo.saveFakeMeal(fakeMeal2);

    const fetchedFakeMeals = await repo.getFakeMealByIds([
      fakeMealTestProps.validFakeMealProps.id,
      'non-existent',
      'fakemeal-2',
    ]);
    expect(fetchedFakeMeals.length).toBe(2);
    expect(fetchedFakeMeals.map((fm) => fm.id)).toContain(
      fakeMealTestProps.validFakeMealProps.id,
    );
    expect(fetchedFakeMeals.map((fm) => fm.id)).toContain('fakemeal-2');
  });

  it('should retrieve fake meals by user ID', async () => {
    const fakeMeals = await repo.getAllFakeMealsByUserId(
      fakeMealTestProps.validFakeMealProps.userId,
    );
    expect(fakeMeals.length).toBe(1);
    expect(fakeMeals[0].userId).toBe(
      fakeMealTestProps.validFakeMealProps.userId,
    );
  });

  it('should retrieve a fake meal by ID and user ID', async () => {
    const fetchedFakeMeal = await repo.getFakeMealByIdAndUserId(
      fakeMealTestProps.validFakeMealProps.id,
      fakeMealTestProps.validFakeMealProps.userId,
    );
    expect(fetchedFakeMeal).not.toBeNull();
    expect(fetchedFakeMeal?.name).toBe(
      fakeMealTestProps.validFakeMealProps.name,
    );
  });

  it('should return null when user ID does not match', async () => {
    const fetchedFakeMeal = await repo.getFakeMealByIdAndUserId(
      fakeMealTestProps.validFakeMealProps.id,
      'wrong-user-id',
    );
    expect(fetchedFakeMeal).toBeNull();
  });

  it('should update an existing fake meal', async () => {
    const updatedFakeMeal = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      name: 'Updated Meal',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveFakeMeal(updatedFakeMeal);

    const fetchedFakeMeal = await repo.getFakeMealById(
      fakeMealTestProps.validFakeMealProps.id,
    );
    expect(fetchedFakeMeal?.name).toBe('Updated Meal');
  });

  it('should delete a fake meal by ID', async () => {
    await repo.deleteFakeMeal(fakeMealTestProps.validFakeMealProps.id);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(0);
  });

  it('should delete a fake meal by ID and user ID', async () => {
    await repo.deleteFakeMealByIdAndUserId(
      fakeMealTestProps.validFakeMealProps.id,
      fakeMealTestProps.validFakeMealProps.userId,
    );

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(0);
  });

  it('should not delete when user ID does not match', async () => {
    await repo.deleteFakeMealByIdAndUserId(
      fakeMealTestProps.validFakeMealProps.id,
      'wrong-user-id',
    );

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(1);
  });

  it('should delete multiple fake meals by IDs', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakemeal-2',
      name: 'Energy Bar',
    });
    const fakeMeal3 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakemeal-3',
      name: 'Protein Bar',
    });
    await repo.saveFakeMeal(fakeMeal2);
    await repo.saveFakeMeal(fakeMeal3);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(3);

    await repo.deleteMultipleFakeMeals([
      fakeMealTestProps.validFakeMealProps.id,
      'fakemeal-2',
    ]);

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(1);
    expect(allFakeMealsAfterDeletion[0].id).toBe('fakemeal-3');
  });

  it('should handle deleting multiple fake meals with non-existent IDs', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakemeal-2',
      name: 'Energy Bar',
    });
    await repo.saveFakeMeal(fakeMeal2);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(2);

    await repo.deleteMultipleFakeMeals([
      fakeMealTestProps.validFakeMealProps.id,
      'non-existent',
    ]);

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(1);
    expect(allFakeMealsAfterDeletion[0].id).toBe('fakemeal-2');
  });

  it('should delete all fake meals for a user', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: '2',
      name: 'Energy Bar',
    });
    await repo.saveFakeMeal(fakeMeal2);

    const fakeMeal3 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: '3',
      userId: 'user-2',
      name: 'Protein Bar',
    });
    await repo.saveFakeMeal(fakeMeal3);

    const allFakeMealsBefore = await repo.getAllFakeMeals();
    expect(allFakeMealsBefore.length).toBe(3);

    await repo.deleteAllFakeMealsForUser(userTestProps.userId);

    const allFakeMealsAfter = await repo.getAllFakeMeals();
    expect(allFakeMealsAfter.length).toBe(1);
    expect(allFakeMealsAfter[0].userId).toBe('user-2');
  });
});
