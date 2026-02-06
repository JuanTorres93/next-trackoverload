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

    // Create and save an ingredient first (needed for meal lines)
    ingredient = Ingredient.create(ingredientTestProps.validIngredientProps);
    await ingredientsRepo.saveIngredient(ingredient);

    // Create a meal with ingredient lines
    meal = Meal.create(mealTestProps.validMealWithIngredientLines());
    await repo.saveMeal(meal);
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  it('should save a meal with its ingredient lines', async () => {
    const newIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
      id: 'ingredient-2',
      name: 'Rice',
    });
    await ingredientsRepo.saveIngredient(newIngredient);

    const ingredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-2',
      parentId: 'meal-2',
      parentType: 'meal',
      ingredient: newIngredient,
      quantityInGrams: 200,
    });

    const newMeal = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      name: 'Rice Bowl',
      ingredientLines: [ingredientLine],
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveMeal(newMeal);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(2);
    expect(allMeals[1].name).toBe('Rice Bowl');
    expect(allMeals[1].ingredientLines).toHaveLength(1);
    expect(allMeals[1].ingredientLines[0].ingredient.name).toBe('Rice');
  });

  it('should update an existing meal', async () => {
    const existingMeal = await repo.getMealById(
      mealTestProps.mealPropsNoIngredientLines.id,
    );
    existingMeal!.update({
      name: 'Updated Meal Name',
    });
    await repo.saveMeal(existingMeal!);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(1);
    expect(allMeals[0].name).toBe('Updated Meal Name');
  });

  it('should update meal ingredient lines when saving', async () => {
    const existingMeal = await repo.getMealById(
      mealTestProps.mealPropsNoIngredientLines.id,
    );
    expect(existingMeal!.ingredientLines).toHaveLength(1);

    // Create a new ingredient and add it to the meal
    const newIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
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
    const fetchedMeal = await repo.getMealById(
      mealTestProps.mealPropsNoIngredientLines.id,
    );

    expect(fetchedMeal!.id).toBe(mealTestProps.mealPropsNoIngredientLines.id);
    expect(fetchedMeal!.name).toBe(
      mealTestProps.mealPropsNoIngredientLines.name,
    );
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
      ingredient = Ingredient.create(ingredientTestProps.validIngredientProps);
      await ingredientsRepo.saveIngredient(ingredient);

      const meals = [
        Meal.create({
          ...mealTestProps.mealPropsNoIngredientLines,
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

        Meal.create({
          ...mealTestProps.mealPropsNoIngredientLines,
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

        Meal.create({
          ...mealTestProps.mealPropsNoIngredientLines,
          id: 'meal-3',
          name: 'Meal 3',
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
    const meal2 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      name: 'Another Meal',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-m2',
          parentId: 'meal-2',
          parentType: 'meal',
          ingredient,
          quantityInGrams: 120,
        }),
      ],
    });

    const mealOtherUser = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-3',
      userId: 'other-user',
      name: 'Other User Meal',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-m3',
          parentId: 'meal-3',
          parentType: 'meal',
          ingredient,
          quantityInGrams: 80,
        }),
      ],
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(mealOtherUser);

    const userMeals = await repo.getAllMealsForUser(
      mealTestProps.mealPropsNoIngredientLines.userId,
    );

    expect(userMeals).toHaveLength(2);
    expect(
      userMeals.every(
        (m) => m.userId === mealTestProps.mealPropsNoIngredientLines.userId,
      ),
    ).toBe(true);
  });

  it('should retrieve a meal by ID and user ID', async () => {
    const fetchedMeal = await repo.getMealByIdForUser(
      mealTestProps.mealPropsNoIngredientLines.id,
      mealTestProps.mealPropsNoIngredientLines.userId,
    );

    expect(fetchedMeal).not.toBeNull();
    expect(fetchedMeal!.id).toBe(mealTestProps.mealPropsNoIngredientLines.id);
    expect(fetchedMeal!.userId).toBe(
      mealTestProps.mealPropsNoIngredientLines.userId,
    );
  });

  it('should return null when meal ID and user ID do not match', async () => {
    const fetchedMeal = await repo.getMealByIdForUser(
      mealTestProps.mealPropsNoIngredientLines.id,
      'wrong-user-id',
    );

    expect(fetchedMeal).toBeNull();
  });

  it('should retrieve meals by recipe ID and user ID', async () => {
    const meal2 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      name: 'Same Recipe Meal',
      createdFromRecipeId:
        mealTestProps.mealPropsNoIngredientLines.createdFromRecipeId,
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-m2',
          parentId: 'meal-2',
          parentType: 'meal',
          ingredient,
          quantityInGrams: 90,
        }),
      ],
    });

    const mealDifferentRecipe = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-3',
      name: 'Different Recipe Meal',
      createdFromRecipeId: 'different-recipe-id',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-m3',
          parentId: 'meal-3',
          parentType: 'meal',
          ingredient,
          quantityInGrams: 110,
        }),
      ],
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(mealDifferentRecipe);

    const mealsFromRecipe = await repo.getMealsByRecipeIdAndUserId(
      mealTestProps.mealPropsNoIngredientLines.createdFromRecipeId,
      mealTestProps.mealPropsNoIngredientLines.userId,
    );

    expect(mealsFromRecipe).toHaveLength(2);
    expect(
      mealsFromRecipe.every(
        (m) =>
          m.createdFromRecipeId ===
          mealTestProps.mealPropsNoIngredientLines.createdFromRecipeId,
      ),
    ).toBe(true);
  });

  it('should retrieve all meals', async () => {
    const meal2 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      name: 'Meal 2',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-2',
          parentId: 'meal-2',
          parentType: 'meal',
          ingredient,
          quantityInGrams: 75,
        }),
      ],
    });
    const meal3 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-3',
      name: 'Meal 3',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-3',
          parentId: 'meal-3',
          parentType: 'meal',
          ingredient,
          quantityInGrams: 125,
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

    await repo.deleteMeal(mealTestProps.mealPropsNoIngredientLines.id);

    const allMealsAfterDeletion = await repo.getAllMeals();
    expect(allMealsAfterDeletion.length).toBe(0);
  });

  it('should reject with null when trying to delete a non-existent meal', async () => {
    await expect(repo.deleteMeal('non-existent-id')).rejects.toEqual(null);
  });

  it('should delete multiple meals by IDs', async () => {
    const meal2 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-2',
          parentId: 'meal-2',
          parentType: 'meal',
          ingredient,
          quantityInGrams: 95,
        }),
      ],
    });
    const meal3 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-3',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-3',
          parentId: 'meal-3',
          parentType: 'meal',
          ingredient,
          quantityInGrams: 115,
        }),
      ],
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(meal3);

    await repo.deleteMultipleMeals(['meal-2', 'meal-3']);

    const remainingMeals = await repo.getAllMeals();
    expect(remainingMeals).toHaveLength(1);
    expect(remainingMeals[0].id).toBe(
      mealTestProps.mealPropsNoIngredientLines.id,
    );
  });

  it('should delete all meals for a user', async () => {
    const meal2 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-2',
          parentId: 'meal-2',
          parentType: 'meal',
          ingredient,
          quantityInGrams: 85,
        }),
      ],
    });
    const mealOtherUser = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-3',
      userId: 'other-user',
      ingredientLines: [
        IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-3',
          parentId: 'meal-3',
          parentType: 'meal',
          ingredient,
          quantityInGrams: 105,
        }),
      ],
    });

    await repo.saveMeal(meal2);
    await repo.saveMeal(mealOtherUser);

    await repo.deleteAllMealsForUser(
      mealTestProps.mealPropsNoIngredientLines.userId,
    );

    const allMeals = await repo.getAllMeals();
    expect(allMeals).toHaveLength(1);
    expect(allMeals[0].userId).toBe('other-user');
  });

  describe('transactions', () => {
    describe('deleteMeal', () => {
      it('should rollback changes if error occurs when deleting meal but deleting meal lines correct', async () => {
        mockForThrowingError(MealLineMongo, 'deleteMany');

        const mealId = mealTestProps.mealPropsNoIngredientLines.id;

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

      it('it should rollback changes if error when deleting mealLines but deleting meal correct', async () => {
        mockForThrowingError(MealMongo, 'deleteOne');

        const mealId = mealTestProps.mealPropsNoIngredientLines.id;

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

    describe('deleteMultipleMeals', () => {
      it('should rollback changes if error occurs when deleting meals but deleting meal lines correct', async () => {
        mockForThrowingError(MealLineMongo, 'deleteMany');

        const mealId = mealTestProps.mealPropsNoIngredientLines.id;

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

      it('should rollback changes if error occurs when deleting meal lines but deleting meals correct', async () => {
        mockForThrowingError(MealMongo, 'deleteMany');

        const mealId = mealTestProps.mealPropsNoIngredientLines.id;

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
});
