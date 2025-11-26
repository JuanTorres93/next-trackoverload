import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateIngredientLineUsecase } from '../UpdateIngredientLine.usecase';
import { MemoryIngredientLinesRepo } from '@/infra/memory/MemoryIngredientLinesRepo';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Id } from '@/domain/types/Id/Id';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { Meal } from '@/domain/entities/meal/Meal';
import {
  ValidationError,
  NotFoundError,
  AuthError,
} from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('UpdateIngredientLineUsecase', () => {
  let ingredientLinesRepo: MemoryIngredientLinesRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let recipesRepo: MemoryRecipesRepo;
  let mealsRepo: MemoryMealsRepo;
  let updateIngredientLineUsecase: UpdateIngredientLineUsecase;
  let testIngredientLine: IngredientLine;
  let testIngredient: Ingredient;
  let alternativeIngredient: Ingredient;
  let testRecipe: Recipe;
  let testMeal: Meal;
  const userId = 'test-user-id';
  const anotherUserId = 'another-user-id';

  beforeEach(async () => {
    ingredientLinesRepo = new MemoryIngredientLinesRepo();
    ingredientsRepo = new MemoryIngredientsRepo();
    recipesRepo = new MemoryRecipesRepo();
    mealsRepo = new MemoryMealsRepo();
    updateIngredientLineUsecase = new UpdateIngredientLineUsecase(
      ingredientLinesRepo,
      ingredientsRepo,
      recipesRepo,
      mealsRepo
    );

    testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: Id.create('test-ingredient-id'),
      name: 'Chicken Breast',
    });

    alternativeIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: Id.create('alternative-ingredient-id'),
      name: 'Turkey Breast',
    });

    testIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      id: Id.create('test-ingredient-line-id'),
      ingredient: testIngredient,
      quantityInGrams: 200,
    });

    testRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      id: 'test-recipe-id',
      userId: userId,
      ingredientLines: [testIngredientLine],
    });

    testMeal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      id: 'test-meal-id',
      userId: userId,
      ingredientLines: [testIngredientLine],
    });

    // Save entities to repos
    await ingredientsRepo.saveIngredient(testIngredient);
    await ingredientsRepo.saveIngredient(alternativeIngredient);
    await ingredientLinesRepo.saveIngredientLine(testIngredientLine);
    await recipesRepo.saveRecipe(testRecipe);
    await mealsRepo.saveMeal(testMeal);
  });

  describe('Successful updates', () => {
    it('should update only the quantity when quantityInGrams is provided for recipe', async () => {
      const request = {
        userId: userId,
        parentEntityType: 'recipe' as const,
        parentEntityId: testRecipe.id,
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 300,
      };

      const result = await updateIngredientLineUsecase.execute(request);

      expect(result.quantityInGrams).toBe(300);
      expect(result.ingredient.id).toBe(testIngredient.id);
      expect(result.ingredient.name).toBe('Chicken Breast');
      expect(result.id).toBe(testIngredientLine.id);
    });

    it('should update only the quantity when quantityInGrams is provided for meal', async () => {
      const request = {
        userId: userId,
        parentEntityType: 'meal' as const,
        parentEntityId: testMeal.id,
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 350,
      };

      const result = await updateIngredientLineUsecase.execute(request);

      expect(result.quantityInGrams).toBe(350);
      expect(result.ingredient.id).toBe(testIngredient.id);
      expect(result.id).toBe(testIngredientLine.id);
    });

    it('should return IngredientLineDTO', async () => {
      const request = {
        userId: userId,
        parentEntityType: 'recipe' as const,
        parentEntityId: testRecipe.id,
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 300,
      };

      const result = await updateIngredientLineUsecase.execute(request);

      // Verificación de que se retorna DTO
      expect(result).not.toBeInstanceOf(IngredientLine);
      for (const prop of dto.ingredientLineDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should update only the ingredient when ingredientId is provided', async () => {
      const request = {
        userId: userId,
        parentEntityType: 'recipe' as const,
        parentEntityId: testRecipe.id,
        ingredientLineId: testIngredientLine.id,
        ingredientId: alternativeIngredient.id,
      };

      const result = await updateIngredientLineUsecase.execute(request);

      expect(result.ingredient.id).toBe(alternativeIngredient.id);
      expect(result.ingredient.name).toBe('Turkey Breast');
      expect(result.quantityInGrams).toBe(200);
      expect(result.id).toBe(testIngredientLine.id);
    });

    it('should update both ingredient and quantity when both are provided', async () => {
      const request = {
        userId: userId,
        parentEntityType: 'meal' as const,
        parentEntityId: testMeal.id,
        ingredientLineId: testIngredientLine.id,
        ingredientId: alternativeIngredient.id,
        quantityInGrams: 250,
      };

      const result = await updateIngredientLineUsecase.execute(request);

      expect(result.ingredient.id).toBe(alternativeIngredient.id);
      expect(result.ingredient.name).toBe('Turkey Breast');
      expect(result.quantityInGrams).toBe(250);
      expect(result.id).toBe(testIngredientLine.id);
    });
  });

  describe('Validation errors', () => {
    it('should throw error if userId is invalid', async () => {
      const invalidUserIds = [null, undefined, 23, true, {}, ''];

      for (const invalidUserId of invalidUserIds) {
        await expect(
          updateIngredientLineUsecase.execute({
            userId: invalidUserId as string,
            parentEntityType: 'recipe' as const,
            parentEntityId: testRecipe.id,
            ingredientLineId: testIngredientLine.id,
            quantityInGrams: 300,
          })
        ).rejects.toThrow(ValidationError);
      }
    });

    it('should throw error if parentEntityId is invalid', async () => {
      const invalidParentEntityIds = [null, undefined, 23, true, {}, ''];

      for (const invalidParentEntityId of invalidParentEntityIds) {
        await expect(
          updateIngredientLineUsecase.execute({
            userId: userId,
            parentEntityType: 'recipe' as const,
            parentEntityId: invalidParentEntityId as string,
            ingredientLineId: testIngredientLine.id,
            quantityInGrams: 300,
          })
        ).rejects.toThrow(ValidationError);
      }
    });

    it('should throw error if ingredientLineId is invalid', async () => {
      const invalidIngredientLineIds = [null, undefined, 23, true, {}, ''];

      for (const invalidIngredientLineId of invalidIngredientLineIds) {
        await expect(
          updateIngredientLineUsecase.execute({
            userId: userId,
            parentEntityType: 'recipe' as const,
            parentEntityId: testRecipe.id,
            ingredientLineId: invalidIngredientLineId as string,
            quantityInGrams: 300,
          })
        ).rejects.toThrow(ValidationError);
      }
    });

    it('should throw error if parentEntityType is invalid', async () => {
      const invalidParentEntityTypes = [
        'invalid',
        null,
        undefined,
        23,
        true,
        {},
      ];

      for (const invalidParentEntityType of invalidParentEntityTypes) {
        await expect(
          updateIngredientLineUsecase.execute({
            userId: userId,
            parentEntityType: invalidParentEntityType as 'recipe' | 'meal',
            parentEntityId: testRecipe.id,
            ingredientLineId: testIngredientLine.id,
            quantityInGrams: 300,
          })
        ).rejects.toThrow(ValidationError);
      }
    });

    it('should throw error when no fields to update are provided', async () => {
      await expect(
        updateIngredientLineUsecase.execute({
          userId: userId,
          parentEntityType: 'recipe' as const,
          parentEntityId: testRecipe.id,
          ingredientLineId: testIngredientLine.id,
        } as Parameters<typeof updateIngredientLineUsecase.execute>[0])
      ).rejects.toThrow(ValidationError);
    });

    it('should throw error when quantityInGrams is invalid', async () => {
      const invalidQuantities = [0, -1, -100, null, undefined, 'invalid', {}];

      for (const invalidQuantity of invalidQuantities) {
        await expect(
          updateIngredientLineUsecase.execute({
            userId: userId,
            parentEntityType: 'recipe' as const,
            parentEntityId: testRecipe.id,
            ingredientLineId: testIngredientLine.id,
            quantityInGrams: invalidQuantity as number,
          })
        ).rejects.toThrow(ValidationError);
      }
    });
  });

  describe('Not found errors', () => {
    it('should throw NotFoundError when recipe does not exist', async () => {
      const request = {
        userId: userId,
        parentEntityType: 'recipe' as const,
        parentEntityId: 'non-existent-recipe-id',
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 300,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when meal does not exist', async () => {
      const request = {
        userId: userId,
        parentEntityType: 'meal' as const,
        parentEntityId: 'non-existent-meal-id',
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 300,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when ingredient does not exist', async () => {
      const request = {
        userId: userId,
        parentEntityType: 'recipe' as const,
        parentEntityId: testRecipe.id,
        ingredientLineId: testIngredientLine.id,
        ingredientId: 'non-existent-ingredient-id',
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when ingredient line does not exist', async () => {
      const request = {
        userId: userId,
        parentEntityType: 'recipe' as const,
        parentEntityId: testRecipe.id,
        ingredientLineId: 'non-existent-ingredient-line-id',
        quantityInGrams: 300,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('Authorization errors', () => {
    it("should throw AuthError when user tries to access another user's recipe", async () => {
      const request = {
        userId: anotherUserId,
        parentEntityType: 'recipe' as const,
        parentEntityId: testRecipe.id,
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 300,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(AuthError);
    });

    it("should throw AuthError when user tries to access another user's meal", async () => {
      const request = {
        userId: anotherUserId,
        parentEntityType: 'meal' as const,
        parentEntityId: testMeal.id,
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 300,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(AuthError);
    });

    it('should throw NotFoundError when ingredient line does not belong to the specified recipe', async () => {
      // Create a different ingredient line not in the recipe
      const differentIngredientLine = IngredientLine.create({
        ...vp.ingredientLinePropsNoIngredient,
        id: Id.create('different-ingredient-line-id'),
        ingredient: testIngredient,
        quantityInGrams: 100,
      });

      await ingredientLinesRepo.saveIngredientLine(differentIngredientLine);

      const request = {
        userId: userId,
        parentEntityType: 'recipe' as const,
        parentEntityId: testRecipe.id,
        ingredientLineId: differentIngredientLine.id,
        quantityInGrams: 300,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when ingredient line does not belong to the specified meal', async () => {
      // Create a different ingredient line not in the meal
      const differentIngredientLine = IngredientLine.create({
        ...vp.ingredientLinePropsNoIngredient,
        id: Id.create('different-ingredient-line-id-2'),
        ingredient: testIngredient,
        quantityInGrams: 100,
      });

      await ingredientLinesRepo.saveIngredientLine(differentIngredientLine);

      const request = {
        userId: userId,
        parentEntityType: 'meal' as const,
        parentEntityId: testMeal.id,
        ingredientLineId: differentIngredientLine.id,
        quantityInGrams: 300,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
