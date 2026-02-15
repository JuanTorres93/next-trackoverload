import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryFakeMealsRepo } from '../MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import * as fakeMealTestProps from '../../../../../tests/createProps/fakeMealTestProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';

describe('MemoryFakeMealsRepo', () => {
  let repo: MemoryFakeMealsRepo;
  let fakeMeal: FakeMeal;

  beforeEach(async () => {
    repo = new MemoryFakeMealsRepo();

    fakeMeal = fakeMealTestProps.createTestFakeMeal();

    await repo.saveFakeMeal(fakeMeal);
  });

  it('should save a fake meal', async () => {
    const newFakeMeal = fakeMealTestProps.createTestFakeMeal({
      id: 'another-id',
      name: 'Energy Bar',
    });
    await repo.saveFakeMeal(newFakeMeal);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(2);
    expect(allFakeMeals[1].name).toBe('Energy Bar');
  });

  it('should update an existing fake meal', async () => {
    const updatedFakeMeal = fakeMealTestProps.createTestFakeMeal({
      name: 'Updated Fake Chicken Breast',
    });
    await repo.saveFakeMeal(updatedFakeMeal);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(1);
    expect(allFakeMeals[0].name).toBe('Updated Fake Chicken Breast');
  });

  it('should retrieve all fake meals by userId', async () => {
    const fakeMeal2 = fakeMealTestProps.createTestFakeMeal({
      id: '2',
      userId: 'user-2',
      name: 'Another Shake',
    });
    await repo.saveFakeMeal(fakeMeal2);

    const user1FakeMeals = await repo.getAllFakeMealsByUserId('user-1');
    const user2FakeMeals = await repo.getAllFakeMealsByUserId('user-2');

    expect(user1FakeMeals.length).toBe(1);
    expect(user1FakeMeals[0].name).toBe('Fake Chicken Breast');
    expect(user2FakeMeals.length).toBe(1);
    expect(user2FakeMeals[0].name).toBe('Another Shake');
  });

  it('should retrieve a fake meal by ID', async () => {
    const fetchedFakeMeal = await repo.getFakeMealById(fakeMeal.id);
    expect(fetchedFakeMeal).not.toBeNull();
    expect(fetchedFakeMeal?.name).toBe('Fake Chicken Breast');
  });

  it('should retrieve multiple fake meals by IDs', async () => {
    const fakeMeal2 = fakeMealTestProps.createTestFakeMeal({
      id: 'fakemeal-2',
      name: 'Energy Bar',
    });
    const fakeMeal3 = fakeMealTestProps.createTestFakeMeal({
      id: 'fakemeal-3',
      name: 'Protein Bar',
    });
    await repo.saveFakeMeal(fakeMeal2);
    await repo.saveFakeMeal(fakeMeal3);

    const fetchedFakeMeals = await repo.getFakeMealByIds([
      fakeMeal.id,
      'fakemeal-2',
    ]);

    expect(fetchedFakeMeals.length).toBe(2);
    expect(fetchedFakeMeals[0].name).toBe('Fake Chicken Breast');
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
    const fakeMeal2 = fakeMealTestProps.createTestFakeMeal({
      id: 'fakemeal-2',
      name: 'Energy Bar',
    });
    await repo.saveFakeMeal(fakeMeal2);

    const fetchedFakeMeals = await repo.getFakeMealByIds([
      fakeMeal.id,
      'non-existent',
      'fakemeal-2',
    ]);

    expect(fetchedFakeMeals.length).toBe(2);
    expect(fetchedFakeMeals.map((fm) => fm.id)).toContain(fakeMeal.id);
    expect(fetchedFakeMeals.map((fm) => fm.id)).toContain('fakemeal-2');
  });

  it('should retrieve a fake meal by ID and userId', async () => {
    const fetchedFakeMeal = await repo.getFakeMealByIdAndUserId(
      fakeMeal.id,
      'user-1',
    );
    expect(fetchedFakeMeal).not.toBeNull();
    expect(fetchedFakeMeal?.name).toBe('Fake Chicken Breast');

    const notFoundFakeMeal = await repo.getFakeMealByIdAndUserId(
      fakeMeal.id,
      'user-2',
    );
    expect(notFoundFakeMeal).toBeNull();
  });

  it('should return null for non-existent fake meal ID', async () => {
    const fetchedFakeMeal = await repo.getFakeMealById('non-existent-id');
    expect(fetchedFakeMeal).toBeNull();
  });

  it('should delete a fake meal by ID', async () => {
    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(1);

    await repo.deleteFakeMeal(fakeMeal.id);

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(0);
  });

  it('should delete a fake meal by ID and userId', async () => {
    const fakeMeal2 = fakeMealTestProps.createTestFakeMeal({
      id: '2',
      userId: 'user-2',
    });
    await repo.saveFakeMeal(fakeMeal2);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(2);

    await repo.deleteFakeMealByIdAndUserId(fakeMeal.id, 'user-1');

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(1);
    expect(allFakeMealsAfterDeletion[0].userId).toBe('user-2');
  });

  it('should delete multiple fake meals by IDs', async () => {
    const fakeMeal2 = fakeMealTestProps.createTestFakeMeal({
      id: '2',
      name: 'Energy Bar',
    });

    const fakeMeal3 = fakeMealTestProps.createTestFakeMeal({
      id: '3',
      name: 'Protein Bar',
    });

    await repo.saveFakeMeal(fakeMeal2);
    await repo.saveFakeMeal(fakeMeal3);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(3);

    await repo.deleteMultipleFakeMeals([fakeMeal.id, '2']);

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(1);
    expect(allFakeMealsAfterDeletion[0].id).toBe('3');
  });

  it('should handle deleting multiple fake meals with non-existent IDs', async () => {
    const fakeMeal2 = fakeMealTestProps.createTestFakeMeal({
      id: '2',
      name: 'Energy Bar',
    });
    await repo.saveFakeMeal(fakeMeal2);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(2);

    await repo.deleteMultipleFakeMeals([fakeMeal.id, 'non-existent']);

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(1);
    expect(allFakeMealsAfterDeletion[0].id).toBe('2');
  });

  it('should delete all fake meals for a user', async () => {
    const fakeMeal2 = fakeMealTestProps.createTestFakeMeal({
      id: '2',
    });

    const fakeMeal3 = fakeMealTestProps.createTestFakeMeal({
      id: '3',
      userId: 'user-2',
    });

    await repo.saveFakeMeal(fakeMeal2);
    await repo.saveFakeMeal(fakeMeal3);

    const allFakeMealsBefore = await repo.getAllFakeMeals();
    expect(allFakeMealsBefore.length).toBe(3);

    await repo.deleteAllFakeMealsForUser(userTestProps.userId);

    const allFakeMealsAfter = await repo.getAllFakeMeals();
    expect(allFakeMealsAfter.length).toBe(1);
    expect(allFakeMealsAfter[0].userId).toBe('user-2');
  });
});
