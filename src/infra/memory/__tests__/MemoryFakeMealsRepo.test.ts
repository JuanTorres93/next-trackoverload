import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryFakeMealsRepo } from '../MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import * as vp from '@/../tests/createProps';

describe('MemoryFakeMealsRepo', () => {
  let repo: MemoryFakeMealsRepo;
  let fakeMeal: FakeMeal;

  beforeEach(async () => {
    repo = new MemoryFakeMealsRepo();
    fakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      name: 'Protein Shake',
      calories: 250,
      protein: 30,
    });
    await repo.saveFakeMeal(fakeMeal);
  });

  it('should save a fake meal', async () => {
    const newFakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: 'another-id',
      name: 'Energy Bar',
    });
    await repo.saveFakeMeal(newFakeMeal);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(2);
    expect(allFakeMeals[1].name).toBe('Energy Bar');
  });

  it('should update an existing fake meal', async () => {
    const updatedFakeMeal = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: vp.validFakeMealProps.id,
      name: 'Updated Protein Shake',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveFakeMeal(updatedFakeMeal);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(1);
    expect(allFakeMeals[0].name).toBe('Updated Protein Shake');
  });

  it('should retrieve all fake meals by userId', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: '2',
      userId: 'user-2',
      name: 'Another Shake',
    });
    await repo.saveFakeMeal(fakeMeal2);

    const user1FakeMeals = await repo.getAllFakeMealsByUserId('user-1');
    const user2FakeMeals = await repo.getAllFakeMealsByUserId('user-2');

    expect(user1FakeMeals.length).toBe(1);
    expect(user1FakeMeals[0].name).toBe('Protein Shake');
    expect(user2FakeMeals.length).toBe(1);
    expect(user2FakeMeals[0].name).toBe('Another Shake');
  });

  it('should retrieve a fake meal by ID', async () => {
    const fetchedFakeMeal = await repo.getFakeMealById(
      vp.validFakeMealProps.id
    );
    expect(fetchedFakeMeal).not.toBeNull();
    expect(fetchedFakeMeal?.name).toBe('Protein Shake');
  });

  it('should retrieve a fake meal by ID and userId', async () => {
    const fetchedFakeMeal = await repo.getFakeMealByIdAndUserId(
      vp.validFakeMealProps.id,
      'user-1'
    );
    expect(fetchedFakeMeal).not.toBeNull();
    expect(fetchedFakeMeal?.name).toBe('Protein Shake');

    const notFoundFakeMeal = await repo.getFakeMealByIdAndUserId(
      vp.validFakeMealProps.id,
      'user-2'
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

    await repo.deleteFakeMeal(vp.validFakeMealProps.id);

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(0);
  });

  it('should delete a fake meal by ID and userId', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: '2',
      userId: 'user-2',
      name: 'Another Shake',
    });
    await repo.saveFakeMeal(fakeMeal2);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(2);

    await repo.deleteFakeMealByIdAndUserId(vp.validFakeMealProps.id, 'user-1');

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(1);
    expect(allFakeMealsAfterDeletion[0].userId).toBe('user-2');
  });

  it('should delete multiple fake meals by IDs', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: '2',
      name: 'Energy Bar',
    });
    const fakeMeal3 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: '3',
      name: 'Protein Bar',
    });
    await repo.saveFakeMeal(fakeMeal2);
    await repo.saveFakeMeal(fakeMeal3);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(3);

    await repo.deleteMultipleFakeMeals([vp.validFakeMealProps.id, '2']);

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(1);
    expect(allFakeMealsAfterDeletion[0].id).toBe('3');
  });

  it('should handle deleting multiple fake meals with non-existent IDs', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...vp.validFakeMealProps,
      id: '2',
      name: 'Energy Bar',
    });
    await repo.saveFakeMeal(fakeMeal2);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(2);

    await repo.deleteMultipleFakeMeals([
      vp.validFakeMealProps.id,
      'non-existent',
    ]);

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(1);
    expect(allFakeMealsAfterDeletion[0].id).toBe('2');
  });
});
