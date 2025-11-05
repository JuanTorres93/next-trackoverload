import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  CreateRecipeUsecase,
  IngredientLineInfo,
} from '../CreateRecipe.usecase';

describe('CreateRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let createRecipeUsecase: CreateRecipeUsecase;
  let testIngredient: Ingredient;
  let testIngredientLineInfo: IngredientLineInfo;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    ingredientsRepo = new MemoryIngredientsRepo();
    createRecipeUsecase = new CreateRecipeUsecase(recipesRepo, ingredientsRepo);

    testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
    });

    ingredientsRepo.saveIngredient(testIngredient);

    testIngredientLineInfo = {
      ingredientId: testIngredient.id,
      quantityInGrams: 200,
    };
  });

  it('should create and save a new recipe', async () => {
    const request = {
      userId: vp.userId,
      name: 'Grilled Chicken',
      ingredientLinesInfo: [testIngredientLineInfo],
    };

    const recipe = await createRecipeUsecase.execute(request);

    expect(recipe).toHaveProperty('id');
    expect(recipe.userId).toBe(vp.userId);
    expect(recipe.name).toBe(request.name);
    expect(recipe.ingredientLines).toHaveLength(1);
    expect(recipe.ingredientLines[0].ingredient.id).toEqual(
      testIngredientLineInfo.ingredientId
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
        ingredientLinesInfo: [testIngredientLineInfo],
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
      ingredientLinesInfo: [],
    };

    await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should calculate correct nutritional info', async () => {
    const request = {
      userId: vp.userId,
      name: 'Test Recipe',
      ingredientLinesInfo: [testIngredientLineInfo],
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
      ingredientLinesInfo: [testIngredientLineInfo],
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
        ingredientLinesInfo: [testIngredientLineInfo],
      };

      // @ts-expect-error testing invalid inputs
      await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );
    }
  });
});
