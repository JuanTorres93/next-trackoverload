import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import * as ingredientTestProps from '../../../../../tests/createProps/ingredientTestProps';
import * as mealTestProps from '../../../../../tests/createProps/mealTestProps';
import * as recipeTestProps from '../../../../../tests/createProps/recipeTestProps';
import { MongoIngredientsRepo } from '../MongoIngredientsRepo';
import { MongoMealsRepo } from '../MongoMealsRepo';
import MealLineMongo from '../models/MealLineMongo';
import MealMongo from '../models/MealMongo';
import { mockForThrowingError } from './mockForThrowingError';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from './setupMongoTestDB';

describe('MongoMealsRepo', () => {
  let repo: MongoMealsRepo;
  let ingredientsRepo: MongoIngredientsRepo;
  let meal: Meal;
  let ingredient: Ingredient;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    ingredientsRepo = new MongoIngredientsRepo();
    repo = new MongoMealsRepo();

    ingredient = ingredientTestProps.createTestIngredient();

    meal = mealTestProps.createTestMeal();

    await ingredientsRepo.saveIngredient(ingredient);
    await repo.saveMeal(meal);
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  it('should save a meal with its ingredient lines', async () => {
    const newIngredient = ingredientTestProps.createTestIngredient({
      id: 'ingredient-2',
      name: 'Rice',
    });

    const ingredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-2',
      parentId: 'meal-2',
      parentType: 'meal',
      ingredient: newIngredient,
    });

    const newMeal = mealTestProps.createTestMeal({
      id: 'meal-2',
      name: 'Rice Bowl',
      ingredientLines: [ingredientLine],
    });

    await ingredientsRepo.saveIngredient(newIngredient);
    await repo.saveMeal(newMeal);

    const allMeals = await repo.getAllMeals();

    expect(allMeals.length).toBe(2);
    expect(allMeals[1].name).toBe('Rice Bowl');
    expect(allMeals[1].ingredientLines).toHaveLength(1);
    expect(allMeals[1].ingredientLines[0].ingredient.name).toBe('Rice');
  });

  it('should update an existing meal', async () => {
    const existingMeal = await repo.getMealById(meal.id);
    existingMeal!.update({
      name: 'Updated Meal Name',
    });
    await repo.saveMeal(existingMeal!);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(1);
    expect(allMeals[0].name).toBe('Updated Meal Name');
  });

  it('should update meal ingredient lines when saving', async () => {
    const existingMeal = await repo.getMealById(meal.id);
    expect(existingMeal!.ingredientLines).toHaveLength(1);

    // Create a new ingredient and add it to the meal
    const newIngredient = ingredientTestProps.createTestIngredient({
      id: 'ingredient-3',
      name: 'Beans',
    });
    await ingredientsRepo.saveIngredient(newIngredient);

    const newLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-new',
      parentId: existingMeal!.id,
      parentType: 'meal',
      ingredient: newIngredient,
      quantityInGrams: 100,
    });

    existingMeal!.addIngredientLine(newLine);
    await repo.saveMeal(existingMeal!);

    const updatedMeal = await repo.getMealById(existingMeal!.id);
    expect(updatedMeal!.ingredientLines).toHaveLength(2);
    expect(
      updatedMeal!.ingredientLines.map((l) => l.ingredient.name),
    ).toContain('Beans');
  });

  it('should retrieve a meal by ID with its ingredient lines', async () => {
    const fetchedMeal = await repo.getMealById(meal.id);

    expect(fetchedMeal!.id).toBe(meal.id);
    expect(fetchedMeal!.name).toBe(meal.name);
    expect(fetchedMeal!.ingredientLines).toHaveLength(1);
    expect(fetchedMeal!.ingredientLines[0].ingredient).toBeInstanceOf(
      Ingredient,
    );
  });

  it('should return null for non-existent meal ID', async () => {
    const fetchedMeal = await repo.getMealById('non-existent-id');

    expect(fetchedMeal).toBeNull();
  });

  describe('getMealByIds', () => {
    beforeEach(async () => {
      await clearMongoTestDB();
      ingredientsRepo = new MongoIngredientsRepo();
      repo = new MongoMealsRepo();

      // Save ingredient
      ingredient = ingredientTestProps.createTestIngredient();
      await ingredientsRepo.saveIngredient(ingredient);

      const meals = [
        mealTestProps.createTestMeal({
          id: 'meal-1',
          name: 'Meal 1',
          ingredientLines: [
            IngredientLine.create({
              ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
              id: 'line-m1',
              parentId: 'meal-1',
              parentType: 'meal',
              ingredient,
              quantityInGrams: 100,
            }),
          ],
        }),

        mealTestProps.createTestMeal({
          id: 'meal-2',
          name: 'Meal 2',
          ingredientLines: [
            IngredientLine.create({
              ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
              id: 'line-m2',
              parentId: 'meal-2',
              parentType: 'meal',
              ingredient,
              quantityInGrams: 150,
            }),
          ],
        }),

        mealTestProps.createTestMeal({
          id: 'meal-3',
          ingredientLines: [
            IngredientLine.create({
              ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
              id: 'line-m3',
              parentId: 'meal-3',
              parentType: 'meal',
              ingredient,
              quantityInGrams: 200,
            }),
          ],
        }),
      ];

      for (const meal of meals) {
        await repo.saveMeal(meal);
      }
    });

    it('should retrieve multiple meals by their IDs', async () => {
      const meals = await repo.getMealByIds(['meal-1', 'meal-3']);

      expect(meals).toHaveLength(2);
      expect(meals.map((m) => m.id)).toContain('meal-1');
      expect(meals.map((m) => m.id)).toContain('meal-3');
      expect(meals[0].ingredientLines).toHaveLength(1);
    });

    it('should retrieve single meal when only one ID is provided', async () => {
      const meals = await repo.getMealByIds(['meal-2']);

      expect(meals).toHaveLength(1);
      expect(meals[0].id).toBe('meal-2');
      expect(meals[0].name).toBe('Meal 2');
    });

    it('should return empty array when provided IDs do not exist', async () => {
      const meals = await repo.getMealByIds([
        'non-existent-1',
        'non-existent-2',
      ]);

      expect(meals).toHaveLength(0);
    });

    it('should return empty array when provided with empty array', async () => {
      const meals = await repo.getMealByIds([]);

      expect(meals).toHaveLength(0);
    });

    it('should filter out non-existent IDs and return only existing ones', async () => {
      const meals = await repo.getMealByIds([
        'meal-1',
        'non-existent',
        'meal-2',
      ]);

      expect(meals).toHaveLength(2);
      expect(meals.map((m) => m.id)).toContain('meal-1');
      expect(meals.map((m) => m.id)).toContain('meal-2');
    });

    it('should retrieve all meals when all IDs are provided', async () => {
      const meals = await repo.getMealByIds(['meal-1', 'meal-2', 'meal-3']);

      expect(meals).toHaveLength(3);
    });
  });

  it('should retrieve all meals for a specific user', async () => {
    const meal2Id = 'meal-2';
    const meal2 = mealTestProps.createTestMeal({
      id: meal2Id,
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-m2',
          parentId: meal2Id,
          parentType: 'meal',
          ingredient,
        }),
      ],
    });

    const mealOtherUserId = 'meal-3';
    const mealOtherUser = mealTestProps.createTestMeal({
      id: mealOtherUserId,
      userId: 'other-user',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-m3',
          parentId: mealOtherUserId,
          parentType: 'meal',
          ingredient,
        }),
      ],
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(mealOtherUser);

    const userMeals = await repo.getAllMealsForUser(meal.userId);

    expect(userMeals).toHaveLength(2);
    expect(userMeals.every((m) => m.userId === meal.userId)).toBe(true);
  });

  it('should retrieve a meal by ID and user ID', async () => {
    const fetchedMeal = await repo.getMealByIdForUser(meal.id, meal.userId);

    expect(fetchedMeal).not.toBeNull();
    expect(fetchedMeal!.id).toBe(meal.id);
    expect(fetchedMeal!.userId).toBe(meal.userId);
  });

  it('should return null when meal ID and user ID do not match', async () => {
    const fetchedMeal = await repo.getMealByIdForUser(meal.id, 'wrong-user-id');

    expect(fetchedMeal).toBeNull();
  });

  it('should retrieve meals by recipe ID and user ID', async () => {
    const meal2Id = 'meal-2';
    const meal2 = mealTestProps.createTestMeal({
      id: meal2Id,
      createdFromRecipeId: meal.createdFromRecipeId,
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-m2',
          parentId: meal2Id,
          parentType: 'meal',
          ingredient,
        }),
      ],
    });

    const meal3Id = 'meal-3';
    const mealDifferentRecipe = mealTestProps.createTestMeal({
      id: meal3Id,
      createdFromRecipeId: 'different-recipe-id',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-m3',
          parentId: meal3Id,
          parentType: 'meal',
          ingredient,
        }),
      ],
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(mealDifferentRecipe);

    const mealsFromRecipe = await repo.getMealsByRecipeIdAndUserId(
      meal.createdFromRecipeId,
      meal.userId,
    );

    expect(mealsFromRecipe).toHaveLength(2);
    expect(
      mealsFromRecipe.every(
        (mealFromRecipe) =>
          mealFromRecipe.createdFromRecipeId === meal.createdFromRecipeId,
      ),
    ).toBe(true);
  });

  it('should retrieve all meals', async () => {
    const meal2Id = 'meal-2';
    const meal2 = mealTestProps.createTestMeal({
      id: meal2Id,
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-2',
          parentId: meal2Id,
          parentType: 'meal',
          ingredient,
        }),
      ],
    });

    const meal3Id = 'meal-3';
    const meal3 = mealTestProps.createTestMeal({
      id: meal3Id,
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-3',
          parentId: meal3Id,
          parentType: 'meal',
          ingredient,
        }),
      ],
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(meal3);

    const allMeals = await repo.getAllMeals();

    expect(allMeals).toHaveLength(3);
  });

  it('should delete a meal and its ingredient lines by ID', async () => {
    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(1);

    await repo.deleteMeal(meal.id);

    const allMealsAfterDeletion = await repo.getAllMeals();
    expect(allMealsAfterDeletion.length).toBe(0);
  });

  it('should reject with null when trying to delete a non-existent meal', async () => {
    await expect(repo.deleteMeal('non-existent-id')).rejects.toEqual(null);
  });

  it('should delete multiple meals by IDs', async () => {
    const meal2Id = 'meal-2';
    const meal2 = mealTestProps.createTestMeal({
      id: meal2Id,
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-2',
          parentId: meal2Id,
          parentType: 'meal',
          ingredient,
          quantityInGrams: 95,
        }),
      ],
    });

    const meal3Id = 'meal-3';
    const meal3 = mealTestProps.createTestMeal({
      id: meal3Id,
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-3',
          parentId: meal3Id,
          parentType: 'meal',
          ingredient,
        }),
      ],
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(meal3);

    await repo.deleteMultipleMeals(['meal-2', 'meal-3']);

    const remainingMeals = await repo.getAllMeals();
    expect(remainingMeals).toHaveLength(1);
    expect(remainingMeals[0].id).toBe(meal.id);
  });

  it('should delete all meals for a user', async () => {
    const meal2Id = 'meal-2';
    const meal2 = mealTestProps.createTestMeal({
      id: meal2Id,
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-2',
          parentId: meal2Id,
          parentType: 'meal',
          ingredient,
        }),
      ],
    });

    const mealOtherUserId = 'meal-3';
    const mealOtherUser = mealTestProps.createTestMeal({
      id: mealOtherUserId,
      userId: 'other-user',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-3',
          parentId: mealOtherUserId,
          parentType: 'meal',
          ingredient,
        }),
      ],
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(mealOtherUser);

    await repo.deleteAllMealsForUser(meal.userId);

    const allMeals = await repo.getAllMeals();
    expect(allMeals).toHaveLength(1);
    expect(allMeals[0].userId).toBe('other-user');
  });

  describe('transactions', () => {
    describe('saveMeal', () => {
      it('should rollback changes if error meal find and update', async () => {
        mockForThrowingError(MealMongo, 'findOneAndUpdate');

        const existingMeal = await repo.getMealById(meal.id);
        existingMeal!.update({
          name: 'Updated Meal Name',
        });

        // Try to save meal - should throw error
        await expect(repo.saveMeal(existingMeal!)).rejects.toThrow(
          /Mocked error.*findOneAndUpdate/i,
        );

        const notUpdatedMeal = await repo.getMealById(meal.id);
        expect(notUpdatedMeal!.name).toBe(meal.name);
      });

      it('should rollback changes if error in deleteMany meal lines', async () => {
        mockForThrowingError(MealLineMongo, 'deleteMany');

        const existingMeal = await repo.getMealById(meal.id);
        existingMeal!.update({
          name: 'Updated Meal Name',
        });

        const anotherIngredient = ingredientTestProps.createTestIngredient({
          id: 'ingredient-2',
          name: 'Tomato',
        });
        await ingredientsRepo.saveIngredient(anotherIngredient);

        const newLine = IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-new',
          parentId: existingMeal!.id,
          parentType: 'meal',
          ingredient: anotherIngredient,
          quantityInGrams: 50,
        });

        existingMeal!.addIngredientLine(newLine);

        // Try to save meal
        await expect(repo.saveMeal(existingMeal!)).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        const notUpdatedMeal = await repo.getMealById(meal.id);
        expect(notUpdatedMeal!.name).toBe(meal.name);
        expect(notUpdatedMeal!.ingredientLines).toHaveLength(1);
        expect(notUpdatedMeal!.ingredientLines[0].ingredient.name).toBe(
          ingredient.name,
        );
      });

      it('should rollback changes if error in insertMany meal lines', async () => {
        mockForThrowingError(MealLineMongo, 'insertMany');

        const existingMeal = await repo.getMealById(meal.id);
        existingMeal!.update({
          name: 'Updated Meal Name',
        });

        const anotherIngredient = ingredientTestProps.createTestIngredient({
          id: 'ingredient-2',
          name: 'Tomato',
        });
        await ingredientsRepo.saveIngredient(anotherIngredient);

        const newLine = IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-new',
          parentId: existingMeal!.id,
          parentType: 'meal',
          ingredient: anotherIngredient,
          quantityInGrams: 50,
        });

        existingMeal!.addIngredientLine(newLine);

        // Try to save meal
        await expect(repo.saveMeal(existingMeal!)).rejects.toThrow(
          /Mocked error.*insertMany/i,
        );

        const notUpdatedMeal = await repo.getMealById(meal.id);
        expect(notUpdatedMeal!.name).toBe(meal.name);
        expect(notUpdatedMeal!.ingredientLines).toHaveLength(1);
        expect(notUpdatedMeal!.ingredientLines[0].ingredient.name).toBe(
          ingredient.name,
        );
      });
    });

    describe('deleteMeal', () => {
      it('should rollback changes if error occurs when deleting meal but deleting meal lines correct', async () => {
        mockForThrowingError(MealLineMongo, 'deleteMany');

        const mealId = meal.id;

        const initialMealCount = await repo.getAllMeals();
        expect(initialMealCount.length).toBe(1);

        const initialMeal = await repo.getMealById(mealId);
        expect(initialMeal).not.toBeNull();
        expect(initialMeal!.ingredientLines).toHaveLength(1);
        const initialMealLineId = initialMeal!.ingredientLines[0].id;

        // Try to delete meal
        await expect(repo.deleteMeal(mealId)).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        // Verify that rollback worked: the meal still exists
        const mealsAfterFailedDelete = await repo.getAllMeals();
        expect(mealsAfterFailedDelete.length).toBe(1);

        const mealAfterFailedDelete = await repo.getMealById(mealId);
        expect(mealAfterFailedDelete).not.toBeNull();
        expect(mealAfterFailedDelete!.id).toBe(mealId);

        // Verify that the meal lines still exist
        expect(mealAfterFailedDelete!.ingredientLines).toHaveLength(1);
        expect(mealAfterFailedDelete!.ingredientLines[0].id).toBe(
          initialMealLineId,
        );
      });

      it('it should rollback changes if error when deleting mealLines but deleting meal correct', async () => {
        mockForThrowingError(MealMongo, 'deleteOne');

        const mealId = meal.id;

        const initialMealCount = await repo.getAllMeals();
        expect(initialMealCount.length).toBe(1);

        const initialMeal = await repo.getMealById(mealId);
        expect(initialMeal).not.toBeNull();
        expect(initialMeal!.ingredientLines).toHaveLength(1);
        const initialMealLineId = initialMeal!.ingredientLines[0].id;

        // Try to delete meal
        await expect(repo.deleteMeal(mealId)).rejects.toThrow(
          /Mocked error.*deleteOne/i,
        );

        // Verify that rollback worked: the meal still exists
        const mealsAfterFailedDelete = await repo.getAllMeals();
        expect(mealsAfterFailedDelete.length).toBe(1);

        const mealAfterFailedDelete = await repo.getMealById(mealId);
        expect(mealAfterFailedDelete).not.toBeNull();
        expect(mealAfterFailedDelete!.id).toBe(mealId);

        // Verify that the meal lines still exist
        expect(mealAfterFailedDelete!.ingredientLines).toHaveLength(1);
        expect(mealAfterFailedDelete!.ingredientLines[0].id).toBe(
          initialMealLineId,
        );
      });
    });

    describe('deleteMultipleMeals', () => {
      it('should rollback changes if error occurs when deleting meals but deleting meal lines correct', async () => {
        mockForThrowingError(MealLineMongo, 'deleteMany');

        const mealId = meal.id;

        const initialMealCount = await repo.getAllMeals();
        expect(initialMealCount.length).toBe(1);

        const initialMeal = await repo.getMealById(mealId);
        expect(initialMeal).not.toBeNull();
        expect(initialMeal!.ingredientLines).toHaveLength(1);
        const initialMealLineId = initialMeal!.ingredientLines[0].id;

        // Try to delete meal
        await expect(repo.deleteMultipleMeals([mealId])).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        // Verify that rollback worked: the meal still exists
        const mealsAfterFailedDelete = await repo.getAllMeals();
        expect(mealsAfterFailedDelete.length).toBe(1);

        const mealAfterFailedDelete = await repo.getMealById(mealId);
        expect(mealAfterFailedDelete).not.toBeNull();
        expect(mealAfterFailedDelete!.id).toBe(mealId);

        // Verify that the meal lines still exist
        expect(mealAfterFailedDelete!.ingredientLines).toHaveLength(1);
        expect(mealAfterFailedDelete!.ingredientLines[0].id).toBe(
          initialMealLineId,
        );
      });

      it('should rollback changes if error occurs when deleting meal lines but deleting meals correct', async () => {
        mockForThrowingError(MealMongo, 'deleteMany');

        const mealId = meal.id;

        const initialMealCount = await repo.getAllMeals();
        expect(initialMealCount.length).toBe(1);

        const initialMeal = await repo.getMealById(mealId);
        expect(initialMeal).not.toBeNull();
        expect(initialMeal!.ingredientLines).toHaveLength(1);
        const initialMealLineId = initialMeal!.ingredientLines[0].id;

        // Try to delete meal
        await expect(repo.deleteMultipleMeals([mealId])).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        // Verificar que el rollback funcionó: el meal todavía existe
        const mealsAfterFailedDelete = await repo.getAllMeals();
        expect(mealsAfterFailedDelete.length).toBe(1);

        const mealAfterFailedDelete = await repo.getMealById(mealId);
        expect(mealAfterFailedDelete).not.toBeNull();
        expect(mealAfterFailedDelete!.id).toBe(mealId);

        // Verificar que las meal lines todavía existen
        expect(mealAfterFailedDelete!.ingredientLines).toHaveLength(1);
        expect(mealAfterFailedDelete!.ingredientLines[0].id).toBe(
          initialMealLineId,
        );
      });
    });
  });

  describe('deleteAllMealsForUser', () => {
    it('should rollback changes if error occurs when deleting meals but deleting meal lines correct', async () => {
      mockForThrowingError(MealLineMongo, 'deleteMany');

      const userId = meal.userId;

      const initialMeals = await repo.getAllMealsForUser(userId);
      expect(initialMeals).toHaveLength(1);

      const initialMealLineId = initialMeals[0].ingredientLines[0].id;

      // Try to delete meals for user
      await expect(repo.deleteAllMealsForUser(userId)).rejects.toThrow(
        /Mocked error.*deleteMany/i,
      );

      // Verify that rollback worked: the meal still exists
      const mealsAfterFailedDelete = await repo.getAllMealsForUser(userId);
      expect(mealsAfterFailedDelete).toHaveLength(1);

      const mealAfterFailedDelete = mealsAfterFailedDelete[0];
      expect(mealAfterFailedDelete.id).toBe(meal.id);

      // Verify that the meal lines still exist
      expect(mealAfterFailedDelete.ingredientLines).toHaveLength(1);
      expect(mealAfterFailedDelete.ingredientLines[0].id).toBe(
        initialMealLineId,
      );
    });

    it('should rollback changes if error occurs when deleting meal lines but deleting meals correct', async () => {
      mockForThrowingError(MealMongo, 'deleteMany');

      const userId = meal.userId;

      const initialMeals = await repo.getAllMealsForUser(userId);
      expect(initialMeals).toHaveLength(1);

      const initialMealLineId = initialMeals[0].ingredientLines[0].id;

      // Try to delete meals for user
      await expect(repo.deleteAllMealsForUser(userId)).rejects.toThrow(
        /Mocked error.*deleteMany/i,
      );

      // Verify that rollback worked: the meal still exists
      const mealsAfterFailedDelete = await repo.getAllMealsForUser(userId);
      expect(mealsAfterFailedDelete).toHaveLength(1);

      const mealAfterFailedDelete = mealsAfterFailedDelete[0];
      expect(mealAfterFailedDelete.id).toBe(meal.id);

      // Verify that the meal lines still exist
      expect(mealAfterFailedDelete.ingredientLines).toHaveLength(1);
      expect(mealAfterFailedDelete.ingredientLines[0].id).toBe(
        initialMealLineId,
      );
    });
  });

  describe('saveMultipleMeals', () => {
    it('should save multiple new meals with their ingredient lines', async () => {
      const meal2Id = 'meal-2';
      const meal2 = mealTestProps.createTestMeal({
        id: meal2Id,
        name: 'Pasta',
        ingredientLines: [
          IngredientLine.create({
            ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
            id: 'line-2',
            parentId: meal2Id,
            parentType: 'meal',
            ingredient,
          }),
        ],
      });

      const meal3Id = 'meal-3';
      const meal3 = mealTestProps.createTestMeal({
        id: meal3Id,
        name: 'Salad',
        ingredientLines: [
          IngredientLine.create({
            ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
            id: 'line-3',
            parentId: meal3Id,
            parentType: 'meal',
            ingredient,
          }),
        ],
      });

      await repo.saveMultipleMeals([meal2, meal3]);

      const allMeals = await repo.getAllMeals();
      expect(allMeals).toHaveLength(3);
      expect(allMeals.map((m) => m.name)).toContain('Pasta');
      expect(allMeals.map((m) => m.name)).toContain('Salad');
    });

    it('should update existing meals when saving multiple', async () => {
      const existingMeal = await repo.getMealById(meal.id);
      existingMeal!.update({ name: 'Updated Chicken Meal' });

      await repo.saveMultipleMeals([existingMeal!]);

      const allMeals = await repo.getAllMeals();
      expect(allMeals).toHaveLength(1);
      expect(allMeals[0].name).toBe('Updated Chicken Meal');
    });

    it('should handle a mix of new and existing meals', async () => {
      const existingMeal = await repo.getMealById(meal.id);
      existingMeal!.update({ name: 'Updated Chicken Meal' });

      const newMealId = 'meal-new';
      const newMeal = mealTestProps.createTestMeal({
        id: newMealId,
        name: 'New Meal',
        ingredientLines: [
          IngredientLine.create({
            ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
            id: 'line-new',
            parentId: newMealId,
            parentType: 'meal',
            ingredient,
          }),
        ],
      });

      await repo.saveMultipleMeals([existingMeal!, newMeal]);

      const allMeals = await repo.getAllMeals();
      expect(allMeals).toHaveLength(2);
      expect(allMeals.map((m) => m.name)).toContain('Updated Chicken Meal');
      expect(allMeals.map((m) => m.name)).toContain('New Meal');
    });

    it('should do nothing when saving an empty array', async () => {
      await repo.saveMultipleMeals([]);

      const allMeals = await repo.getAllMeals();
      expect(allMeals).toHaveLength(1);
    });

    describe('transactions', () => {
      it('should rollback all changes if error occurs in bulkWrite', async () => {
        mockForThrowingError(MealMongo, 'bulkWrite');

        const meal2Id = 'meal-2';
        const meal2 = mealTestProps.createTestMeal({
          id: meal2Id,
          name: 'New Meal',
          ingredientLines: [
            IngredientLine.create({
              ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
              id: 'line-2',
              parentId: meal2Id,
              parentType: 'meal',
              ingredient,
            }),
          ],
        });

        await expect(repo.saveMultipleMeals([meal2])).rejects.toThrow(
          /Mocked error.*bulkWrite/i,
        );

        const allMeals = await repo.getAllMeals();
        expect(allMeals).toHaveLength(1);
        expect(allMeals[0].id).toBe(meal.id);
      });

      it('should rollback all changes if error occurs in deleteMany meal lines', async () => {
        mockForThrowingError(MealLineMongo, 'deleteMany');

        const existingMeal = await repo.getMealById(meal.id);
        existingMeal!.update({ name: 'Updated Meal Name' });

        await expect(repo.saveMultipleMeals([existingMeal!])).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        const notUpdatedMeal = await repo.getMealById(meal.id);
        expect(notUpdatedMeal!.name).toBe(meal.name);
        expect(notUpdatedMeal!.ingredientLines).toHaveLength(1);
      });

      it('should rollback all changes if error occurs in insertMany meal lines', async () => {
        mockForThrowingError(MealLineMongo, 'insertMany');

        const existingMeal = await repo.getMealById(meal.id);
        existingMeal!.update({ name: 'Updated Meal Name' });

        await expect(repo.saveMultipleMeals([existingMeal!])).rejects.toThrow(
          /Mocked error.*insertMany/i,
        );

        const notUpdatedMeal = await repo.getMealById(meal.id);
        expect(notUpdatedMeal!.name).toBe(meal.name);
        expect(notUpdatedMeal!.ingredientLines).toHaveLength(1);
      });
    });
  });
});
