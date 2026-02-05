import * as fakeMealTestProps from '../../../../../tests/createProps/fakeMealTestProps';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { MongoFakeMealsRepo } from '../MongoFakeMealsRepo';
import {
  setupMongoTestDB,
  teardownMongoTestDB,
  clearMongoTestDB,
} from './setupMongoTestDB';

describe('MongoFakeMealsRepo', () => {
  let repo: MongoFakeMealsRepo;
  let fakeMeal: FakeMeal;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    repo = new MongoFakeMealsRepo();
    fakeMeal = FakeMeal.create(fakeMealTestProps.validFakeMealProps);
    await repo.saveFakeMeal(fakeMeal);
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  it('should save a fake meal', async () => {
    const newFakeMeal = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakeMeal-2',
      name: 'Fake Rice Bowl',
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveFakeMeal(newFakeMeal);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(2);
    expect(allFakeMeals[1].name).toBe('Fake Rice Bowl');
  });

  it('should update an existing fake meal', async () => {
    const existingFakeMeal = await repo.getFakeMealById(
      fakeMealTestProps.validFakeMealProps.id,
    );
    existingFakeMeal!.update({
      name: 'Updated Fake Meal',
      calories: 300,
    });
    await repo.saveFakeMeal(existingFakeMeal!);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(1);
    expect(allFakeMeals[0].name).toBe('Updated Fake Meal');
    expect(allFakeMeals[0].calories).toBe(300);
  });

  it('should retrieve a fake meal by ID', async () => {
    const fetchedFakeMeal = await repo.getFakeMealById(
      fakeMealTestProps.validFakeMealProps.id,
    );

    expect(fetchedFakeMeal).not.toBeNull();
    expect(fetchedFakeMeal!.id).toBe(fakeMealTestProps.validFakeMealProps.id);
    expect(fetchedFakeMeal!.name).toBe(
      fakeMealTestProps.validFakeMealProps.name,
    );
  });

  it('should return null for non-existent fake meal ID', async () => {
    const fetchedFakeMeal = await repo.getFakeMealById('non-existent-id');

    expect(fetchedFakeMeal).toBeNull();
  });

  describe('getFakeMealByIds', () => {
    beforeEach(async () => {
      await clearMongoTestDB();
      repo = new MongoFakeMealsRepo();

      const fakeMeals = [
        FakeMeal.create({
          ...fakeMealTestProps.validFakeMealProps,
          id: 'fakeMeal-1',
          name: 'Fake Meal 1',
        }),

        FakeMeal.create({
          ...fakeMealTestProps.validFakeMealProps,
          id: 'fakeMeal-2',
          name: 'Fake Meal 2',
        }),

        FakeMeal.create({
          ...fakeMealTestProps.validFakeMealProps,
          id: 'fakeMeal-3',
          name: 'Fake Meal 3',
        }),
      ];

      for (const meal of fakeMeals) {
        await repo.saveFakeMeal(meal);
      }
    });

    it('should retrieve multiple fake meals by their IDs', async () => {
      const fakeMeals = await repo.getFakeMealByIds([
        'fakeMeal-1',
        'fakeMeal-3',
      ]);

      expect(fakeMeals).toHaveLength(2);
      expect(fakeMeals.map((m) => m.id)).toContain('fakeMeal-1');
      expect(fakeMeals.map((m) => m.id)).toContain('fakeMeal-3');
    });

    it('should retrieve single fake meal when only one ID is provided', async () => {
      const fakeMeals = await repo.getFakeMealByIds(['fakeMeal-2']);

      expect(fakeMeals).toHaveLength(1);
      expect(fakeMeals[0].id).toBe('fakeMeal-2');
      expect(fakeMeals[0].name).toBe('Fake Meal 2');
    });

    it('should return empty array when provided IDs do not exist', async () => {
      const fakeMeals = await repo.getFakeMealByIds([
        'non-existent-1',
        'non-existent-2',
      ]);

      expect(fakeMeals).toHaveLength(0);
    });

    it('should return empty array when provided with empty array', async () => {
      const fakeMeals = await repo.getFakeMealByIds([]);

      expect(fakeMeals).toHaveLength(0);
    });

    it('should filter out non-existent IDs and return only existing ones', async () => {
      const fakeMeals = await repo.getFakeMealByIds([
        'fakeMeal-1',
        'non-existent',
        'fakeMeal-2',
      ]);

      expect(fakeMeals).toHaveLength(2);
      expect(fakeMeals.map((m) => m.id)).toContain('fakeMeal-1');
      expect(fakeMeals.map((m) => m.id)).toContain('fakeMeal-2');
    });

    it('should retrieve all fake meals when all IDs are provided', async () => {
      const fakeMeals = await repo.getFakeMealByIds([
        'fakeMeal-1',
        'fakeMeal-2',
        'fakeMeal-3',
      ]);

      expect(fakeMeals).toHaveLength(3);
    });
  });

  it('should retrieve all fake meals by user ID', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakeMeal-2',
      name: 'Another Fake Meal',
    });
    const fakeMealOtherUser = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakeMeal-3',
      userId: 'other-user',
      name: 'Other User Meal',
    });

    await repo.saveFakeMeal(fakeMeal2);
    await repo.saveFakeMeal(fakeMealOtherUser);

    const userFakeMeals = await repo.getAllFakeMealsByUserId(
      fakeMealTestProps.validFakeMealProps.userId,
    );

    expect(userFakeMeals).toHaveLength(2);
    expect(
      userFakeMeals.every(
        (m) => m.userId === fakeMealTestProps.validFakeMealProps.userId,
      ),
    ).toBe(true);
  });

  it('should retrieve a fake meal by ID and user ID', async () => {
    const fetchedFakeMeal = await repo.getFakeMealByIdAndUserId(
      fakeMealTestProps.validFakeMealProps.id,
      fakeMealTestProps.validFakeMealProps.userId,
    );

    expect(fetchedFakeMeal).not.toBeNull();
    expect(fetchedFakeMeal!.id).toBe(fakeMealTestProps.validFakeMealProps.id);
    expect(fetchedFakeMeal!.userId).toBe(
      fakeMealTestProps.validFakeMealProps.userId,
    );
  });

  it('should return null when fake meal ID and user ID do not match', async () => {
    const fetchedFakeMeal = await repo.getFakeMealByIdAndUserId(
      fakeMealTestProps.validFakeMealProps.id,
      'wrong-user-id',
    );

    expect(fetchedFakeMeal).toBeNull();
  });

  it('should retrieve all fake meals', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakeMeal-2',
      name: 'Fake Meal 2',
    });
    const fakeMeal3 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakeMeal-3',
      name: 'Fake Meal 3',
    });

    await repo.saveFakeMeal(fakeMeal2);
    await repo.saveFakeMeal(fakeMeal3);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals).toHaveLength(3);
  });

  it('should delete a fake meal by ID', async () => {
    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(1);

    await repo.deleteFakeMeal(fakeMealTestProps.validFakeMealProps.id);

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(0);
  });

  it('should reject when trying to delete a non-existent fake meal', async () => {
    await expect(repo.deleteFakeMeal('non-existent-id')).rejects.toEqual(null);
  });

  it('should delete multiple fake meals by IDs', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakeMeal-2',
    });
    const fakeMeal3 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakeMeal-3',
    });

    await repo.saveFakeMeal(fakeMeal2);
    await repo.saveFakeMeal(fakeMeal3);

    await repo.deleteMultipleFakeMeals(['fakeMeal-2', 'fakeMeal-3']);

    const remainingFakeMeals = await repo.getAllFakeMeals();
    expect(remainingFakeMeals).toHaveLength(1);
    expect(remainingFakeMeals[0].id).toBe(
      fakeMealTestProps.validFakeMealProps.id,
    );
  });

  it('should delete a fake meal by ID and user ID', async () => {
    await repo.deleteFakeMealByIdAndUserId(
      fakeMealTestProps.validFakeMealProps.id,
      fakeMealTestProps.validFakeMealProps.userId,
    );

    const fetchedFakeMeal = await repo.getFakeMealById(
      fakeMealTestProps.validFakeMealProps.id,
    );
    expect(fetchedFakeMeal).toBeNull();
  });

  it('should reject when deleting fake meal with wrong user ID', async () => {
    await expect(
      repo.deleteFakeMealByIdAndUserId(
        fakeMealTestProps.validFakeMealProps.id,
        'wrong-user-id',
      ),
    ).rejects.toEqual(null);
  });

  it('should delete all fake meals for a user', async () => {
    const fakeMeal2 = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakeMeal-2',
    });
    const fakeMealOtherUser = FakeMeal.create({
      ...fakeMealTestProps.validFakeMealProps,
      id: 'fakeMeal-3',
      userId: 'other-user',
    });

    await repo.saveFakeMeal(fakeMeal2);
    await repo.saveFakeMeal(fakeMealOtherUser);

    await repo.deleteAllFakeMealsForUser(
      fakeMealTestProps.validFakeMealProps.userId,
    );

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals).toHaveLength(1);
    expect(allFakeMeals[0].userId).toBe('other-user');
  });
});
