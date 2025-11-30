import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { AddIngredientToRecipeUsecase } from '../AddIngredientToRecipe.usecase';

describe('AddIngredientToRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let addIngredientToRecipeUsecase: AddIngredientToRecipeUsecase;
  let testRecipe: Recipe;
  let newIngredient: Ingredient;

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    ingredientsRepo = new MemoryIngredientsRepo();
    addIngredientToRecipeUsecase = new AddIngredientToRecipeUsecase(
      recipesRepo,
      ingredientsRepo
    );

    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    await ingredientsRepo.saveIngredient(testIngredient);

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
    });

    testRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });

    newIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: 'new-ingredient-id',
    });
  });

  it('should add ingredient to recipe successfully', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalIngredientCount = testRecipe.ingredientLines.length;

    await ingredientsRepo.saveIngredient(newIngredient);

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
      ingredientId: newIngredient.id,
      quantityInGrams: 150,
    };

    const result = await addIngredientToRecipeUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(originalIngredientCount + 1);

    const ingredientLineIds = result.ingredientLines.map((line) => line.id);

    expect(ingredientLineIds).toContain(newIngredient.id);
  });

  it('should return RecipeDTO', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    await ingredientsRepo.saveIngredient(newIngredient);

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
      ingredientId: newIngredient.id,
      quantityInGrams: 150,
    };

    const result = await addIngredientToRecipeUsecase.execute(request);

    expect(result).not.toBeInstanceOf(Recipe);
    for (const prop of dto.recipeDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      recipeId: 'non-existent-id',
      userId: vp.userId,
      ingredientId: newIngredient.id,
      quantityInGrams: 150,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      /Recipe/
    );
  });

  it('should throw ValidationError for invalid recipeId', async () => {
    const request = {
      recipeId: '',
      userId: vp.userId,
      ingredientId: newIngredient.id,
      quantityInGrams: 150,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw error for not found ingredient', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
      ingredientId: 'non-existent-ingredient-id',
      quantityInGrams: 150,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should update recipe updatedAt timestamp', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    await ingredientsRepo.saveIngredient(newIngredient);
    const originalUpdatedAt = testRecipe.updatedAt;

    // Wait a moment to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 10));

    const request = {
      userId: vp.userId,
      recipeId: testRecipe.id,
      ingredientId: newIngredient.id,
      quantityInGrams: 150,
    };

    const result = await addIngredientToRecipeUsecase.execute(request);

    expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });

  it('should throw ValidationError for invalid userId', async () => {
    const invalidUserIds = [null, '', '   ', 123, {}, []];

    for (const invalidUserId of invalidUserIds) {
      const request = {
        recipeId: testRecipe.id,
        userId: invalidUserId,
        ingredientId: newIngredient.id,
        quantityInGrams: 150,
      };

      await expect(
        // @ts-expect-error testing invalid inputs
        addIngredientToRecipeUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when ingredient already exists in recipe', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
      ingredientId: testRecipe.ingredientLines[0].ingredient.id,
      quantityInGrams: 150,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      /Recipe.*Ingredient.*already.*exists/
    );
  });
});
