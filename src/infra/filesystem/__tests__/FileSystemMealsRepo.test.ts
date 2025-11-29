import * as vp from '@/../tests/createProps';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { FileSystemMealsRepo } from '../FileSystemMealsRepo';
import fs from 'fs/promises';
import path from 'path';

const validIngredientProps = {
  ...vp.validIngredientProps,
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
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient,
      quantityInGrams: 150,
    });

    meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      name: 'Grilled Chicken',
      ingredientLines: [ingredientLine],
    });

    await repo.saveMeal(meal);
  });

  afterEach(async () => {
    try {
      await fs.rm(testMealsDir, { recursive: true, force: true });
      await fs.rm(testIngredientLinesDir, { recursive: true, force: true });
    } catch (error) {
      // Directories might not exist
    }
  });

  it('should save a meal', async () => {
    const newMeal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
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
      ...vp.mealPropsNoIngredientLines,
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
      vp.mealPropsNoIngredientLines.id
    );
    expect(fetchedMeal).not.toBeNull();
    expect(fetchedMeal?.name).toBe('Grilled Chicken');
  });

  it('should retrieve all meals by a user', async () => {
    const userMeals = await repo.getAllMealsForUser(vp.userId);
    expect(userMeals.length).toBe(1);
    expect(userMeals[0].id).toBe(vp.mealPropsNoIngredientLines.id);
    expect(userMeals[0].name).toBe('Grilled Chicken');
  });

  it('should retrieve a meal by ID for a user', async () => {
    const fetchedMeal = await repo.getMealByIdForUser(
      vp.mealPropsNoIngredientLines.id,
      vp.userId
    );
    expect(fetchedMeal).not.toBeNull();
    expect(fetchedMeal?.name).toBe('Grilled Chicken');
  });

  it('should return null for non-existent meal ID', async () => {
    const fetchedMeal = await repo.getMealById('non-existent-id');
    expect(fetchedMeal).toBeNull();
  });

  it('should delete a meal by ID', async () => {
    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(1);

    await repo.deleteMeal(vp.mealPropsNoIngredientLines.id);

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
      `${ingredientLine.id}.json`
    );
    const lineFileExists = await fs
      .access(lineFilePath)
      .then(() => true)
      .catch(() => false);
    expect(lineFileExists).toBe(true);
  });

  it('should delete ingredient lines when meal is deleted', async () => {
    await repo.deleteMeal(vp.mealPropsNoIngredientLines.id);

    // Verify ingredient line file is deleted
    const lineFilePath = path.join(
      testIngredientLinesDir,
      `${ingredientLine.id}.json`
    );
    const lineFileExists = await fs
      .access(lineFilePath)
      .then(() => true)
      .catch(() => false);
    expect(lineFileExists).toBe(false);
  });
});
