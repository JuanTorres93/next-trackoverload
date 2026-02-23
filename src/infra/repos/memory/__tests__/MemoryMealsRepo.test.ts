import { Meal } from '@/domain/entities/meal/Meal';
import { beforeEach, describe, expect, it } from 'vitest';
import * as mealTestProps from '../../../../../tests/createProps/mealTestProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import { MemoryMealsRepo } from '../MemoryMealsRepo';

describe('MemoryMealsRepo', () => {
  let repo: MemoryMealsRepo;
  let meal: Meal;

  beforeEach(async () => {
    repo = new MemoryMealsRepo();

    meal = mealTestProps.createTestMeal();

    await repo.saveMeal(meal);
  });

  it('should save a meal', async () => {
    const newMeal = mealTestProps.createTestMeal({
      id: 'new-meal',
      name: 'Chicken Salad',
    });
    await repo.saveMeal(newMeal);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(2);
    expect(allMeals[1].name).toBe('Chicken Salad');
  });

  it('should update an existing meal', async () => {
    const updatedMeal = mealTestProps.createTestMeal({
      name: 'Updated Grilled Chicken',
    });
    await repo.saveMeal(updatedMeal);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(1);
    expect(allMeals[0].name).toBe('Updated Grilled Chicken');
  });

  it('should retrieve a meal by ID', async () => {
    const fetchedMeal = await repo.getMealById(meal.id);
    expect(fetchedMeal).not.toBeNull();
    expect(fetchedMeal?.name).toBe('Chicken Meal');
  });

  it('should retrieve multiple meals by IDs', async () => {
    const meal2 = mealTestProps.createTestMeal({
      id: 'meal-2',
      name: 'Chicken Salad',
    });

    const meal3 = mealTestProps.createTestMeal({
      id: 'meal-3',
      name: 'Turkey Sandwich',
    });
    await repo.saveMeal(meal2);
    await repo.saveMeal(meal3);

    const fetchedMeals = await repo.getMealByIds([meal.id, meal2.id]);
    expect(fetchedMeals.length).toBe(2);
    expect(fetchedMeals[0].name).toBe('Chicken Meal');
    expect(fetchedMeals[1].name).toBe('Chicken Salad');
  });

  it('should return empty array when no IDs match', async () => {
    const fetchedMeals = await repo.getMealByIds([
      'non-existent-1',
      'non-existent-2',
    ]);
    expect(fetchedMeals.length).toBe(0);
  });

  it('should retrieve only existing meals when some IDs do not exist', async () => {
    const meal2 = mealTestProps.createTestMeal({
      id: 'meal-2',
      name: 'Chicken Salad',
    });
    await repo.saveMeal(meal2);

    const fetchedMeals = await repo.getMealByIds([
      meal.id,
      'non-existent',
      meal2.id,
    ]);
    expect(fetchedMeals.length).toBe(2);
    expect(fetchedMeals.map((m) => m.id)).toContain(meal.id);
    expect(fetchedMeals.map((m) => m.id)).toContain(meal2.id);
  });

  it('should retrieve all meals by a user', async () => {
    const userMeals = await repo.getAllMealsForUser(userTestProps.userId);
    expect(userMeals.length).toBe(1);
    expect(userMeals[0].id).toBe(meal.id);
    expect(userMeals[0].name).toBe('Chicken Meal');
  });

  it('should retrieve a meal by ID for a user', async () => {
    const fetchedMeal = await repo.getMealByIdForUser(
      meal.id,
      userTestProps.userId,
    );
    expect(fetchedMeal).not.toBeNull();
    expect(fetchedMeal?.name).toBe('Chicken Meal');
  });

  it('should retrieve meals by recipeId and userId', async () => {
    const meal2 = mealTestProps.createTestMeal({
      id: 'meal-2',
      name: 'Chicken Salad',
      createdFromRecipeId: meal.createdFromRecipeId,
    });

    const meal3 = mealTestProps.createTestMeal({
      id: 'meal-3',
      name: 'Turkey Sandwich',
      createdFromRecipeId: 'different-recipe-id',
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(meal3);

    const fetchedMeals = await repo.getMealsByRecipeIdAndUserId(
      meal.createdFromRecipeId,
      userTestProps.userId,
    );

    expect(fetchedMeals.length).toBe(2);
    expect(fetchedMeals.map((m) => m.id)).toContain(meal.id);
    expect(fetchedMeals.map((m) => m.id)).toContain(meal2.id);
    expect(fetchedMeals.map((m) => m.id)).not.toContain(meal3.id);
  });

  it('should return empty array when no meals match recipeId and userId', async () => {
    const fetchedMeals = await repo.getMealsByRecipeIdAndUserId(
      'non-existent-recipe-id',
      userTestProps.userId,
    );
    expect(fetchedMeals.length).toBe(0);
  });

  it('should return empty array when recipeId matches but userId does not', async () => {
    const fetchedMeals = await repo.getMealsByRecipeIdAndUserId(
      meal.createdFromRecipeId,
      'different-user-id',
    );
    expect(fetchedMeals.length).toBe(0);
  });

  it('should return null for non-existent meal ID', async () => {
    const fetchedMeal = await repo.getMealById('non-existent-id');
    expect(fetchedMeal).toBeNull();
  });

  it('should delete a meal by ID', async () => {
    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(1);

    await repo.deleteMeal(meal.id);

    const allMealsAfterDeletion = await repo.getAllMeals();
    expect(allMealsAfterDeletion.length).toBe(0);
  });

  it('should delete multiple meals by IDs', async () => {
    const meal2 = mealTestProps.createTestMeal({
      id: 'meal-2',
    });

    const meal3 = mealTestProps.createTestMeal({
      id: 'meal-3',
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(meal3);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(3);

    await repo.deleteMultipleMeals([meal.id, meal2.id]);

    const allMealsAfterDeletion = await repo.getAllMeals();
    expect(allMealsAfterDeletion.length).toBe(1);
    expect(allMealsAfterDeletion[0].id).toBe(meal3.id);
  });

  it('should handle deleting multiple meals with non-existent IDs', async () => {
    const meal2 = mealTestProps.createTestMeal({
      id: 'meal-2',
    });
    await repo.saveMeal(meal2);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(2);

    await repo.deleteMultipleMeals([meal.id, 'non-existent']);

    const allMealsAfterDeletion = await repo.getAllMeals();
    expect(allMealsAfterDeletion.length).toBe(1);
    expect(allMealsAfterDeletion[0].id).toBe(meal2.id);
  });

  it('should delete all meals for a user', async () => {
    const meal2 = mealTestProps.createTestMeal({
      id: 'meal-2',
      name: 'Chicken Salad',
    });

    const meal3 = mealTestProps.createTestMeal({
      id: 'meal-3',
      userId: 'user-2',
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(meal3);

    const allMealsBefore = await repo.getAllMeals();
    expect(allMealsBefore.length).toBe(3);

    await repo.deleteAllMealsForUser(userTestProps.userId);

    const allMealsAfter = await repo.getAllMeals();
    expect(allMealsAfter.length).toBe(1);
    expect(allMealsAfter[0].userId).toBe(meal3.userId);
  });

  describe('saveMultipleMeals', () => {
    it('should save multiple new meals', async () => {
      const meal2 = mealTestProps.createTestMeal({
        id: 'meal-2',
        name: 'Pasta',
      });
      const meal3 = mealTestProps.createTestMeal({
        id: 'meal-3',
        name: 'Salad',
      });

      await repo.saveMultipleMeals([meal2, meal3]);

      const allMeals = await repo.getAllMeals();
      expect(allMeals.length).toBe(3);
      expect(allMeals.map((m) => m.name)).toContain('Pasta');
      expect(allMeals.map((m) => m.name)).toContain('Salad');
    });

    it('should update existing meals when saving multiple', async () => {
      const updatedMeal = mealTestProps.createTestMeal({
        name: 'Updated Chicken Meal',
      });

      await repo.saveMultipleMeals([updatedMeal]);

      const allMeals = await repo.getAllMeals();
      expect(allMeals.length).toBe(1);
      expect(allMeals[0].name).toBe('Updated Chicken Meal');
    });

    it('should handle a mix of new and existing meals', async () => {
      const updatedMeal = mealTestProps.createTestMeal({
        name: 'Updated Chicken Meal',
      });
      const newMeal = mealTestProps.createTestMeal({
        id: 'meal-new',
        name: 'New Meal',
      });

      await repo.saveMultipleMeals([updatedMeal, newMeal]);

      const allMeals = await repo.getAllMeals();
      expect(allMeals.length).toBe(2);
      expect(allMeals.map((m) => m.name)).toContain('Updated Chicken Meal');
      expect(allMeals.map((m) => m.name)).toContain('New Meal');
    });

    it('should do nothing when saving an empty array', async () => {
      await repo.saveMultipleMeals([]);

      const allMeals = await repo.getAllMeals();
      expect(allMeals.length).toBe(1);
    });
  });
});
