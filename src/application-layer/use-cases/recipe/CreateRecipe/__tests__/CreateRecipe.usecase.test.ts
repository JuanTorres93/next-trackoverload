import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateRecipeUsecase } from '../CreateRecipe.usecase';
import { toIngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { Recipe } from '@/domain/entities/recipe/Recipe';

describe('CreateRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let createRecipeUsecase: CreateRecipeUsecase;
  let testIngredient: Ingredient;
  let testIngredientLine: IngredientLine;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    createRecipeUsecase = new CreateRecipeUsecase(recipesRepo);

    testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
    });

    testIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: testIngredient,
      quantityInGrams: 200,
    });
  });

  it('should create and save a new recipe', async () => {
    const request = {
      userId: vp.userId,
      name: 'Grilled Chicken',
      ingredientLines: [testIngredientLine],
    };

    const recipe = await createRecipeUsecase.execute(request);

    expect(recipe).toHaveProperty('id');
    expect(recipe.userId).toBe(vp.userId);
    expect(recipe.name).toBe(request.name);
    expect(recipe.ingredientLines).toHaveLength(1);
    expect(recipe.ingredientLines[0]).toEqual(
      toIngredientLineDTO(testIngredientLine)
    );
    expect(recipe).toHaveProperty('createdAt');
    expect(recipe).toHaveProperty('updatedAt');

    const savedRecipe = await recipesRepo.getRecipeById(recipe.id);

    // @ts-expect-error savedRecipe won't be null here
    expect(toRecipeDTO(savedRecipe)).toEqual(recipe);
  });

  it('should throw an error if name is invalid', async () => {
    const invalidNames = ['', '   ', null, 123, {}, []];

    for (const name of invalidNames) {
      const request = {
        userId: vp.userId,
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
      userId: vp.userId,
      name: 'Test Recipe',
      ingredientLines: [],
    };

    await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should calculate correct nutritional info', async () => {
    const request = {
      userId: vp.userId,
      name: 'Test Recipe',
      ingredientLines: [testIngredientLine],
    };

    const recipe = await createRecipeUsecase.execute(request);

    // 200g of chicken breast (165 cal/100g, 31g protein/100g)
    expect(recipe.calories).toBe(330); // 165 * 2
    expect(recipe.protein).toBe(62); // 31 * 2
  });

  it('should return RecipeDTO', async () => {
    const request = {
      userId: vp.userId,
      name: 'Test Recipe',
      ingredientLines: [testIngredientLine],
    };

    const result = await createRecipeUsecase.execute(request);

    expect(result).not.toBeInstanceOf(Recipe);
    // Check that the result has all expected DTO properties
    for (const prop of dto.recipeDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw an error if userId is invalid', async () => {
    const invalidUserIds = ['', null, 123, {}, [], undefined, NaN];

    for (const userId of invalidUserIds) {
      const request = {
        userId,
        name: 'Test Recipe',
        ingredientLines: [testIngredientLine],
      };

      // @ts-expect-error testing invalid inputs
      await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );
    }
  });
});
