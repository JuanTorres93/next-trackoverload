import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { FileSystemRecipesRepo } from '../FileSystemRecipesRepo';
import fs from 'fs/promises';
import path from 'path';

import * as vp from '@/../tests/createProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';

describe('FileSystemRecipesRepo', () => {
  let repo: FileSystemRecipesRepo;
  let recipe: Recipe;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  const testRecipesDir = './__test_data__/recipes';
  const testIngredientLinesDir = './__test_data__/ingredientlines_recipes';

  beforeEach(async () => {
    repo = new FileSystemRecipesRepo(testRecipesDir, testIngredientLinesDir);
    ingredient = Ingredient.create(vp.validIngredientProps);

    ingredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient,
      quantityInGrams: 200,
    });

    recipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await repo.saveRecipe(recipe);
  });

  afterEach(async () => {
    try {
      await fs.rm(testRecipesDir, { recursive: true, force: true });
      await fs.rm(testIngredientLinesDir, { recursive: true, force: true });
    } catch (error) {
      // Directories might not exist
    }
  });

  it('should save a recipe', async () => {
    const newRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      id: 'another-recipe-id',
      name: 'Cake',
      ingredientLines: [ingredientLine],
    });
    await repo.saveRecipe(newRecipe);

    const allRecipes = await repo.getAllRecipes();
    expect(allRecipes.length).toBe(2);

    const savedRecipe = allRecipes.find((r) => r.id === 'another-recipe-id');
    expect(savedRecipe).toBeDefined();
    expect(savedRecipe?.name).toBe('Cake');
  });

  it('should update an existing recipe', async () => {
    const updatedRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [ingredientLine],
      name: 'Updated Bread',
    });
    await repo.saveRecipe(updatedRecipe);

    const allRecipes = await repo.getAllRecipes();
    expect(allRecipes.length).toBe(1);
    expect(allRecipes[0].name).toBe('Updated Bread');
  });

  it('should retrieve a recipe by ID', async () => {
    const fetchedRecipe = await repo.getRecipeById(
      vp.recipePropsNoIngredientLines.id,
    );
    expect(fetchedRecipe).not.toBeNull();
    expect(fetchedRecipe?.name).toBe(vp.recipePropsNoIngredientLines.name);
  });

  it('should retrieve recipes by user ID', async () => {
    const userRecipes = await repo.getAllRecipesByUserId(userTestProps.userId);
    expect(userRecipes.length).toBe(1);
    expect(userRecipes[0].userId).toBe(userTestProps.userId);
  });

  it('should retrieve a recipe by ID and user ID', async () => {
    const fetchedRecipe = await repo.getRecipeByIdAndUserId(
      vp.recipePropsNoIngredientLines.id,
      userTestProps.userId,
    );
    expect(fetchedRecipe).not.toBeNull();
    expect(fetchedRecipe?.name).toBe(vp.recipePropsNoIngredientLines.name);
  });

  it('should return null for non-existent recipe ID', async () => {
    const fetchedRecipe = await repo.getRecipeById('non-existent-id');
    expect(fetchedRecipe).toBeNull();
  });

  it('should delete a recipe by ID', async () => {
    const allRecipes = await repo.getAllRecipes();
    expect(allRecipes.length).toBe(1);

    await repo.deleteRecipe(vp.recipePropsNoIngredientLines.id);

    const allRecipesAfterDeletion = await repo.getAllRecipes();
    expect(allRecipesAfterDeletion.length).toBe(0);
  });

  it('should persist recipe and ingredient lines to filesystem', async () => {
    // Verify recipe file exists
    const recipeFilePath = path.join(testRecipesDir, `${recipe.id}.json`);
    const recipeFileExists = await fs
      .access(recipeFilePath)
      .then(() => true)
      .catch(() => false);
    expect(recipeFileExists).toBe(true);

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

  it('should delete ingredient lines when recipe is deleted', async () => {
    await repo.deleteRecipe(vp.recipePropsNoIngredientLines.id);

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

  it('should delete all recipes for a user', async () => {
    const ingredientLine2 = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      id: 'line-2',
      ingredient,
      quantityInGrams: 100,
    });
    const recipe2 = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      id: 'recipe-2',
      name: 'Pasta',
      ingredientLines: [ingredientLine2],
    });
    const ingredientLine3 = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      id: 'line-3',
      ingredient,
      quantityInGrams: 150,
    });
    const recipe3 = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      id: 'recipe-3',
      userId: 'user-2',
      name: 'Pizza',
      ingredientLines: [ingredientLine3],
    });
    await repo.saveRecipe(recipe2);
    await repo.saveRecipe(recipe3);

    const allRecipesBefore = await repo.getAllRecipes();
    expect(allRecipesBefore.length).toBe(3);

    await repo.deleteAllRecipesForUser(userTestProps.userId);

    const allRecipesAfter = await repo.getAllRecipes();
    expect(allRecipesAfter.length).toBe(1);
    expect(allRecipesAfter[0].userId).toBe('user-2');
  });
});
