import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRecipesRepo } from '../MemoryRecipesRepo';

import * as recipeTestProps from '../../../../../tests/createProps/recipeTestProps';
import * as ingredientTestProps from '../../../../../tests/createProps/ingredientTestProps';
import * as userTestProps from '../../../../../tests/createProps/userTestProps';

describe('MemoryRecipesRepo', () => {
  let repo: MemoryRecipesRepo;
  let recipe: Recipe;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;

  beforeEach(async () => {
    repo = new MemoryRecipesRepo();
    ingredient = Ingredient.create(ingredientTestProps.validIngredientProps);

    ingredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient,
      quantityInGrams: 200,
    });

    recipe = Recipe.create({
      ...recipeTestProps.recipePropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await repo.saveRecipe(recipe);
  });

  it('should save a recipe', async () => {
    const newRecipe = Recipe.create({
      ...recipeTestProps.recipePropsNoIngredientLines,
      id: 'another-recipe-id',
      name: 'Cake',
      ingredientLines: [ingredientLine],
    });
    await repo.saveRecipe(newRecipe);

    const allRecipes = await repo.getAllRecipes();
    expect(allRecipes.length).toBe(2);
    expect(allRecipes[1].name).toBe('Cake');
  });

  it('should update an existing recipe', async () => {
    const updatedRecipe = Recipe.create({
      ...recipeTestProps.recipePropsNoIngredientLines,
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
      recipeTestProps.recipePropsNoIngredientLines.id,
    );
    expect(fetchedRecipe).not.toBeNull();
    expect(fetchedRecipe?.name).toBe(
      recipeTestProps.recipePropsNoIngredientLines.name,
    );
  });

  it('should return null for non-existent recipe ID', async () => {
    const fetchedRecipe = await repo.getRecipeById('non-existent-id');
    expect(fetchedRecipe).toBeNull();
  });

  it('should delete a recipe by ID', async () => {
    const allRecipes = await repo.getAllRecipes();
    expect(allRecipes.length).toBe(1);

    await repo.deleteRecipe(recipeTestProps.recipePropsNoIngredientLines.id);

    const allRecipesAfterDeletion = await repo.getAllRecipes();
    expect(allRecipesAfterDeletion.length).toBe(0);
  });

  it('should delete all recipes for a user', async () => {
    const recipe2 = Recipe.create({
      ...recipeTestProps.recipePropsNoIngredientLines,
      id: 'recipe-2',
      name: 'Pasta',
      ingredientLines: [ingredientLine],
    });
    await repo.saveRecipe(recipe2);

    const recipe3 = Recipe.create({
      ...recipeTestProps.recipePropsNoIngredientLines,
      id: 'recipe-3',
      userId: 'user-2',
      name: 'Pizza',
      ingredientLines: [ingredientLine],
    });
    await repo.saveRecipe(recipe3);

    const allRecipesBefore = await repo.getAllRecipes();
    expect(allRecipesBefore.length).toBe(3);

    await repo.deleteAllRecipesForUser(userTestProps.userId);

    const allRecipesAfter = await repo.getAllRecipes();
    expect(allRecipesAfter.length).toBe(1);
    expect(allRecipesAfter[0].userId).toBe('user-2');
  });
});
