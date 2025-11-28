import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Id } from '@/domain/value-objects/Id/Id';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { MemoryIngredientLinesRepo } from '@/infra/memory/MemoryIngredientLinesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { AddIngredientToRecipeUsecase } from '../AddIngredientToRecipe.usecase';

describe('AddIngredientToRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let ingredientLinesRepo: MemoryIngredientLinesRepo;
  let addIngredientToRecipeUsecase: AddIngredientToRecipeUsecase;
  let testRecipe: Recipe;
  let newIngredientLine: IngredientLine;
  let newIngredient: Ingredient;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    ingredientLinesRepo = new MemoryIngredientLinesRepo();
    addIngredientToRecipeUsecase = new AddIngredientToRecipeUsecase(
      recipesRepo,
      ingredientLinesRepo
    );

    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: Id.create('existing-ingredient-id'),
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: testIngredient,
    });

    testRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });

    newIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: Id.create('new-ingredient-id'),
    });

    newIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: newIngredient,
    });

    ingredientLinesRepo.saveIngredientLine(newIngredientLine);
  });

  it('should add ingredient to recipe successfully', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalIngredientCount = testRecipe.ingredientLines.length;

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
      ingredientLine: newIngredientLine,
    };

    const result = await addIngredientToRecipeUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(originalIngredientCount + 1);

    const ingredientLineIds = result.ingredientLines.map((line) => line.id);

    expect(ingredientLineIds).toContain(newIngredientLine.id);
  });

  it('should return RecipeDTO', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
      ingredientLine: newIngredientLine,
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
      ingredientLine: newIngredientLine,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      /Recipe/
    );
  });

  it('should throw NotFoundError when IngredientLine does not exist', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const notInRepoIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      id: Id.create('non-existent-ingredient-line-id'),
      ingredient: newIngredient,
    });

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
      ingredientLine: notInRepoIngredientLine,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      /IngredientLine/
    );
  });

  it('should throw ValidationError for invalid recipeId', async () => {
    const request = {
      recipeId: '',
      userId: vp.userId,
      ingredientLine: newIngredientLine,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw error for invalid ingredientLine', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const invalidIngredientLines = [null, {}, { id: '123' }, []];

    for (const invalidLine of invalidIngredientLines) {
      const request = {
        recipeId: testRecipe.id,
        userId: vp.userId,
        ingredientLine: invalidLine,
      };

      await expect(
        // @ts-expect-error testing invalid inputs
        addIngredientToRecipeUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should update recipe updatedAt timestamp', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalUpdatedAt = testRecipe.updatedAt;

    // Wait a moment to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 2));

    const request = {
      userId: vp.userId,
      recipeId: testRecipe.id,
      ingredientLine: newIngredientLine,
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
        ingredientLine: newIngredientLine,
      };

      await expect(
        // @ts-expect-error testing invalid inputs
        addIngredientToRecipeUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when ingredient already exists in recipe', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    // Get the ingredient from the existing ingredient line in the recipe
    const existingIngredient = testRecipe.ingredientLines[0].ingredient;

    // Create a new ingredient line with the same ingredient
    const duplicateIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: existingIngredient,
    });

    const request = {
      recipeId: testRecipe.id,
      userId: vp.userId,
      ingredientLine: duplicateIngredientLine,
    };

    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
    await expect(addIngredientToRecipeUsecase.execute(request)).rejects.toThrow(
      /already exists in recipe/
    );
  });
});
