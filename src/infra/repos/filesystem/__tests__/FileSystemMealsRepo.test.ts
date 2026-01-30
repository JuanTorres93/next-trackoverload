import * as vp from '@/../tests/createProps';
import * as mealTestProps from '../../../../../tests/createProps/mealTestProps';
import * as recipeTestProps from '../../../../../tests/createProps/recipeTestProps';
import * as ingredientTestProps from '../../../../../tests/createProps/ingredientTestProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { FileSystemMealsRepo } from '../FileSystemMealsRepo';
import fs from 'fs/promises';
import path from 'path';

const validIngredientProps = {
  ...ingredientTestProps.validIngredientProps,
  nutritionalInfoPer100g: {
    calories: 165,
    protein: 25,
  },
};

describe('FileSystemMealsRepo', () => {
  let repo: FileSystemMealsRepo;
  let meal: Meal;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  const testMealsDir = './__test_data__/meals';
  const testIngredientLinesDir = './__test_data__/ingredientlines';

  beforeEach(async () => {
    repo = new FileSystemMealsRepo(testMealsDir, testIngredientLinesDir);
    ingredient = Ingredient.create(validIngredientProps);

    ingredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient,
      quantityInGrams: 150,
    });

    meal = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      name: 'Grilled Chicken',
      ingredientLines: [ingredientLine],
    });

    await repo.saveMeal(meal);
  });

  afterEach(async () => {
    try {
      await fs.rm(testMealsDir, { recursive: true, force: true });
      await fs.rm(testIngredientLinesDir, { recursive: true, force: true });
    } catch {
      // Directories might not exist
    }
  });

  it('should save a meal', async () => {
    const newMeal = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'new-meal',
      name: 'Chicken Salad',
      ingredientLines: [ingredientLine],
    });
    await repo.saveMeal(newMeal);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(2);

    const savedMeal = allMeals.find((m) => m.id === 'new-meal');
    expect(savedMeal).toBeDefined();
    expect(savedMeal?.name).toBe('Chicken Salad');
  });

  it('should update an existing meal', async () => {
    const updatedMeal = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      name: 'Updated Grilled Chicken',
      ingredientLines: [ingredientLine],
    });
    await repo.saveMeal(updatedMeal);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(1);
    expect(allMeals[0].name).toBe('Updated Grilled Chicken');
  });

  it('should retrieve a meal by ID', async () => {
    const fetchedMeal = await repo.getMealById(
      mealTestProps.mealPropsNoIngredientLines.id,
    );
    expect(fetchedMeal).not.toBeNull();
    expect(fetchedMeal?.name).toBe('Grilled Chicken');
  });

  it('should retrieve multiple meals by IDs', async () => {
    const ingredientLine2 = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-2',
      ingredient,
      quantityInGrams: 200,
    });
    const meal2 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      name: 'Chicken Salad',
      ingredientLines: [ingredientLine2],
    });
    const ingredientLine3 = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-3',
      ingredient,
      quantityInGrams: 100,
    });
    const meal3 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-3',
      name: 'Turkey Sandwich',
      ingredientLines: [ingredientLine3],
    });
    await repo.saveMeal(meal2);
    await repo.saveMeal(meal3);

    const fetchedMeals = await repo.getMealByIds([
      mealTestProps.mealPropsNoIngredientLines.id,
      'meal-2',
    ]);
    expect(fetchedMeals.length).toBe(2);
    expect(fetchedMeals[0].name).toBe('Grilled Chicken');
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
    const ingredientLine2 = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-2',
      ingredient,
      quantityInGrams: 200,
    });
    const meal2 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      name: 'Chicken Salad',
      ingredientLines: [ingredientLine2],
    });
    await repo.saveMeal(meal2);

    const fetchedMeals = await repo.getMealByIds([
      mealTestProps.mealPropsNoIngredientLines.id,
      'non-existent',
      'meal-2',
    ]);
    expect(fetchedMeals.length).toBe(2);
    expect(fetchedMeals.map((m) => m.id)).toContain(
      mealTestProps.mealPropsNoIngredientLines.id,
    );
    expect(fetchedMeals.map((m) => m.id)).toContain('meal-2');
  });

  it('should retrieve all meals by a user', async () => {
    const userMeals = await repo.getAllMealsForUser(userTestProps.userId);
    expect(userMeals.length).toBe(1);
    expect(userMeals[0].id).toBe(mealTestProps.mealPropsNoIngredientLines.id);
    expect(userMeals[0].name).toBe('Grilled Chicken');
  });

  it('should retrieve a meal by ID for a user', async () => {
    const fetchedMeal = await repo.getMealByIdForUser(
      mealTestProps.mealPropsNoIngredientLines.id,
      userTestProps.userId,
    );
    expect(fetchedMeal).not.toBeNull();
    expect(fetchedMeal?.name).toBe('Grilled Chicken');
  });

  it('should retrieve meals by recipeId and userId', async () => {
    const ingredientLine2 = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-2',
      ingredient,
      quantityInGrams: 200,
    });
    const meal2 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      name: 'Chicken Salad',
      ingredientLines: [ingredientLine2],
      createdFromRecipeId:
        mealTestProps.mealPropsNoIngredientLines.createdFromRecipeId,
    });
    const ingredientLine3 = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-3',
      ingredient,
      quantityInGrams: 100,
    });
    const meal3 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-3',
      name: 'Turkey Sandwich',
      ingredientLines: [ingredientLine3],
      createdFromRecipeId: 'different-recipe-id',
    });
    await repo.saveMeal(meal2);
    await repo.saveMeal(meal3);

    const fetchedMeals = await repo.getMealsByRecipeIdAndUserId(
      mealTestProps.mealPropsNoIngredientLines.createdFromRecipeId,
      userTestProps.userId,
    );
    expect(fetchedMeals.length).toBe(2);
    expect(fetchedMeals.map((m) => m.id)).toContain(
      mealTestProps.mealPropsNoIngredientLines.id,
    );
    expect(fetchedMeals.map((m) => m.id)).toContain('meal-2');
    expect(fetchedMeals.map((m) => m.id)).not.toContain('meal-3');
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
      mealTestProps.mealPropsNoIngredientLines.createdFromRecipeId,
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

    await repo.deleteMeal(mealTestProps.mealPropsNoIngredientLines.id);

    const allMealsAfterDeletion = await repo.getAllMeals();
    expect(allMealsAfterDeletion.length).toBe(0);
  });

  it('should persist meal and ingredient lines to filesystem', async () => {
    // Verify meal file exists
    const mealFilePath = path.join(testMealsDir, `${meal.id}.json`);
    const mealFileExists = await fs
      .access(mealFilePath)
      .then(() => true)
      .catch(() => false);
    expect(mealFileExists).toBe(true);

    // Verify ingredient line file exists
    const lineFilePath = path.join(
      testIngredientLinesDir,
      `${ingredientLine.id}.json`,
    );
    const lineFileExists = await fs
      .access(lineFilePath)
      .then(() => true)
      .catch(() => false);
    expect(lineFileExists).toBe(true);
  });

  it('should delete ingredient lines when meal is deleted', async () => {
    await repo.deleteMeal(mealTestProps.mealPropsNoIngredientLines.id);

    // Verify ingredient line file is deleted
    const lineFilePath = path.join(
      testIngredientLinesDir,
      `${ingredientLine.id}.json`,
    );
    const lineFileExists = await fs
      .access(lineFilePath)
      .then(() => true)
      .catch(() => false);
    expect(lineFileExists).toBe(false);
  });

  it('should delete multiple meals by IDs', async () => {
    const ingredientLine2 = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-2',
      ingredient,
      quantityInGrams: 200,
    });
    const meal2 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      name: 'Chicken Salad',
      ingredientLines: [ingredientLine2],
    });
    const ingredientLine3 = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-3',
      ingredient,
      quantityInGrams: 100,
    });
    const meal3 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-3',
      name: 'Turkey Sandwich',
      ingredientLines: [ingredientLine3],
    });
    await repo.saveMeal(meal2);
    await repo.saveMeal(meal3);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(3);

    await repo.deleteMultipleMeals([
      mealTestProps.mealPropsNoIngredientLines.id,
      'meal-2',
    ]);

    const allMealsAfterDeletion = await repo.getAllMeals();
    expect(allMealsAfterDeletion.length).toBe(1);
    expect(allMealsAfterDeletion[0].id).toBe('meal-3');

    // Verify ingredient lines are also deleted
    const lineFilePath = path.join(
      testIngredientLinesDir,
      `${ingredientLine.id}.json`,
    );
    const lineFileExists = await fs
      .access(lineFilePath)
      .then(() => true)
      .catch(() => false);
    expect(lineFileExists).toBe(false);

    const line2FilePath = path.join(
      testIngredientLinesDir,
      `${ingredientLine2.id}.json`,
    );
    const line2FileExists = await fs
      .access(line2FilePath)
      .then(() => true)
      .catch(() => false);
    expect(line2FileExists).toBe(false);
  });

  it('should handle deleting multiple meals with non-existent IDs', async () => {
    const ingredientLine2 = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-4',
      ingredient,
      quantityInGrams: 120,
    });
    const meal2 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      name: 'Chicken Salad',
      ingredientLines: [ingredientLine2],
    });
    await repo.saveMeal(meal2);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(2);

    await repo.deleteMultipleMeals([
      mealTestProps.mealPropsNoIngredientLines.id,
      'non-existent',
    ]);

    const allMealsAfterDeletion = await repo.getAllMeals();
    expect(allMealsAfterDeletion.length).toBe(1);
    expect(allMealsAfterDeletion[0].id).toBe('meal-2');
  });

  it('should delete all meals for a user', async () => {
    const ingredientLine2 = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-5',
      ingredient,
      quantityInGrams: 120,
    });
    const meal2 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-2',
      name: 'Chicken Salad',
      ingredientLines: [ingredientLine2],
    });
    const ingredientLine3 = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      id: 'line-6',
      ingredient,
      quantityInGrams: 100,
    });
    const meal3 = Meal.create({
      ...mealTestProps.mealPropsNoIngredientLines,
      id: 'meal-3',
      userId: 'user-2',
      name: 'Turkey Sandwich',
      ingredientLines: [ingredientLine3],
    });
    await repo.saveMeal(meal2);
    await repo.saveMeal(meal3);

    const allMealsBefore = await repo.getAllMeals();
    expect(allMealsBefore.length).toBe(3);

    await repo.deleteAllMealsForUser(userTestProps.userId);

    const allMealsAfter = await repo.getAllMeals();
    expect(allMealsAfter.length).toBe(1);
    expect(allMealsAfter[0].userId).toBe('user-2');
  });
});
