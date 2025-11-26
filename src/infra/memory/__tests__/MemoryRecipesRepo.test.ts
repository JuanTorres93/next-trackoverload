import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRecipesRepo } from '../MemoryRecipesRepo';
import { Id } from '@/domain/types/Id/Id';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';

import * as vp from '@/../tests/createProps';

describe('MemoryRecipesRepo', () => {
  let repo: MemoryRecipesRepo;
  let recipe: Recipe;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;

  beforeEach(async () => {
    repo = new MemoryRecipesRepo();
    ingredient = Ingredient.create(vp.validIngredientProps);

    ingredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient,
      quantityInGrams: 200,
    });

    recipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await repo.saveRecipe(recipe);
  });

  it('should save a recipe', async () => {
    const newRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      id: Id.create('2'),
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
      vp.recipePropsNoIngredientLines.id.value
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

    await repo.deleteRecipe(vp.recipePropsNoIngredientLines.id.value);

    const allRecipesAfterDeletion = await repo.getAllRecipes();
    expect(allRecipesAfterDeletion.length).toBe(0);
  });
});
