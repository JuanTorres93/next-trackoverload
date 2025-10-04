import { beforeEach, describe, expect, it } from 'vitest';
import { CreateRecipeUsecase } from '../CreateRecipe.usecase';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

describe('CreateRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let createRecipeUsecase: CreateRecipeUsecase;
  let testIngredient: Ingredient;
  let testIngredientLine: IngredientLine;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    createRecipeUsecase = new CreateRecipeUsecase(recipesRepo);

    testIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: testIngredient,
      quantityInGrams: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should create and save a new recipe', async () => {
    const request = {
      name: 'Grilled Chicken',
      ingredientLines: [testIngredientLine],
    };

    const recipe = await createRecipeUsecase.execute(request);

    expect(recipe).toHaveProperty('id');
    expect(recipe.name).toBe(request.name);
    expect(recipe.ingredientLines).toHaveLength(1);
    expect(recipe.ingredientLines[0]).toEqual(testIngredientLine);
    expect(recipe).toHaveProperty('createdAt');
    expect(recipe).toHaveProperty('updatedAt');

    const savedRecipe = await recipesRepo.getRecipeById(recipe.id);
    expect(savedRecipe).toEqual(recipe);
  });

  it('should throw an error if name is invalid', async () => {
    const invalidNames = ['', '   ', null, 123, {}, []];

    for (const name of invalidNames) {
      const request = {
        name: name,
        ingredientLines: [testIngredientLine],
      };

      // @ts-expect-error testing invalid inputs
      await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );
    }
  });

  it('should throw an error if ingredientLines is empty', async () => {
    const request = {
      name: 'Test Recipe',
      ingredientLines: [],
    };

    await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should calculate correct nutritional info', async () => {
    const request = {
      name: 'Test Recipe',
      ingredientLines: [testIngredientLine],
    };

    const recipe = await createRecipeUsecase.execute(request);

    // 200g of chicken breast (165 cal/100g, 31g protein/100g)
    expect(recipe.calories).toBe(330); // 165 * 2
    expect(recipe.protein).toBe(62); // 31 * 2
  });
});
