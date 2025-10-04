import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllRecipesUsecase } from '../GetAllRecipes.usecase';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { v4 as uuidv4 } from 'uuid';

describe('GetAllRecipesUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let getAllRecipesUsecase: GetAllRecipesUsecase;
  let testRecipes: Recipe[];

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    getAllRecipesUsecase = new GetAllRecipesUsecase(recipesRepo);

    const testIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const testIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: testIngredient,
      quantityInGrams: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testRecipes = [
      Recipe.create({
        id: uuidv4(),
        name: 'Grilled Chicken',
        ingredientLines: [testIngredientLine],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      Recipe.create({
        id: uuidv4(),
        name: 'Chicken Salad',
        ingredientLines: [testIngredientLine],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];
  });

  it('should return all recipes when they exist', async () => {
    for (const recipe of testRecipes) {
      await recipesRepo.saveRecipe(recipe);
    }

    const result = await getAllRecipesUsecase.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(expect.arrayContaining(testRecipes));
  });

  it('should return empty array when no recipes exist', async () => {
    const result = await getAllRecipesUsecase.execute();

    expect(result).toEqual([]);
  });
});
