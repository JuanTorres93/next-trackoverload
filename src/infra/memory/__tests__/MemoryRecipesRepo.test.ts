import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRecipesRepo } from '../MemoryRecipesRepo';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';

const validIngredientProps = {
  id: '1',
  name: 'Flour',
  nutritionalInfoPer100g: {
    calories: 364,
    protein: 10,
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

describe('MemoryRecipesRepo', () => {
  let repo: MemoryRecipesRepo;
  let recipe: Recipe;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;

  beforeEach(async () => {
    repo = new MemoryRecipesRepo();
    ingredient = Ingredient.create(validIngredientProps);

    ingredientLine = IngredientLine.create({
      id: '1',
      ingredient,
      quantityInGrams: 200,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    recipe = Recipe.create({
      id: '1',
      name: 'Basic Bread',
      ingredientLines: [ingredientLine],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await repo.saveRecipe(recipe);
  });

  it('should save a recipe', async () => {
    const newRecipe = Recipe.create({
      id: '2',
      name: 'Cake',
      ingredientLines: [ingredientLine],
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveRecipe(newRecipe);

    const allRecipes = await repo.getAllRecipes();
    expect(allRecipes.length).toBe(2);
    expect(allRecipes[1].name).toBe('Cake');
  });

  it('should update an existing recipe', async () => {
    const updatedRecipe = Recipe.create({
      id: '1',
      name: 'Updated Bread',
      ingredientLines: [ingredientLine],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveRecipe(updatedRecipe);

    const allRecipes = await repo.getAllRecipes();
    expect(allRecipes.length).toBe(1);
    expect(allRecipes[0].name).toBe('Updated Bread');
  });

  it('should retrieve a recipe by ID', async () => {
    const fetchedRecipe = await repo.getRecipeById('1');
    expect(fetchedRecipe).not.toBeNull();
    expect(fetchedRecipe?.name).toBe('Basic Bread');
  });

  it('should return null for non-existent recipe ID', async () => {
    const fetchedRecipe = await repo.getRecipeById('non-existent-id');
    expect(fetchedRecipe).toBeNull();
  });

  it('should delete a recipe by ID', async () => {
    const allRecipes = await repo.getAllRecipes();
    expect(allRecipes.length).toBe(1);

    await repo.deleteRecipe('1');

    const allRecipesAfterDeletion = await repo.getAllRecipes();
    expect(allRecipesAfterDeletion.length).toBe(0);
  });
});
