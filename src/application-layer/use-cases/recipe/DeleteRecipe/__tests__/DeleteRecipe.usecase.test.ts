import * as vp from '@/../tests/createProps';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryImageManager } from '@/infra';
import { MemoryIngredientLinesRepo } from '@/infra/memory/MemoryIngredientLinesRepo';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { createTestImage } from '../../../../../../tests/helpers/imageTestHelpers';
import { DeleteRecipeUsecase } from '../DeleteRecipe.usecase';

describe('DeleteRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let ingredientLinesRepo: MemoryIngredientLinesRepo;
  let memoryImageManager: MemoryImageManager;
  let deleteRecipeUsecase: DeleteRecipeUsecase;
  let testRecipe: Recipe;

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    ingredientLinesRepo = new MemoryIngredientLinesRepo();
    memoryImageManager = new MemoryImageManager();
    deleteRecipeUsecase = new DeleteRecipeUsecase(
      recipesRepo,
      ingredientLinesRepo,
      memoryImageManager
    );

    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: testIngredient,
    });

    await ingredientLinesRepo.saveIngredientLine(testIngredientLine);

    testRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });
  });

  it('should delete recipe successfully', async () => {
    await ingredientLinesRepo.saveIngredientLine(testRecipe.ingredientLines[0]);
    await recipesRepo.saveRecipe(testRecipe);
    const request = { id: testRecipe.id, userId: vp.userId };
    await deleteRecipeUsecase.execute(request);

    const deletedRecipe = await recipesRepo.getRecipeById(testRecipe.id);
    expect(deletedRecipe).toBeNull();
  });

  it('should delete its IngredientLines', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = { id: testRecipe.id, userId: vp.userId };
    await deleteRecipeUsecase.execute(request);

    for (const line of testRecipe.ingredientLines) {
      const deletedLine = await ingredientLinesRepo.getIngredientLineById(
        line.id
      );
      expect(deletedLine).toBeNull();
    }
  });

  it('should delete recipe image if exists', async () => {
    const testImage = createTestImage();
    const uploadedImage = await memoryImageManager.uploadImage(
      testImage,
      'test-recipe-image.png',
      { allowedMimeTypes: ['image/png'], quality: 0.8 }
    );

    const recipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: testRecipe.ingredientLines,
      imageUrl: uploadedImage.url,
    });

    expect(recipe.imageUrl).toBeDefined();
    const currentImages = memoryImageManager.getImageCount();
    expect(currentImages).toBe(1);

    await recipesRepo.saveRecipe(recipe);

    const request = { id: recipe.id, userId: vp.userId };
    await deleteRecipeUsecase.execute(request);
    for (const line of recipe.ingredientLines) {
      const deletedLine = await ingredientLinesRepo.getIngredientLineById(
        line.id
      );
      expect(deletedLine).toBeNull();
    }

    const afterDeleteImages = memoryImageManager.getImageCount();
    expect(afterDeleteImages).toBe(0);
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = { id: 'non-existent-id', userId: vp.userId };

    await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should throw ValidationError for invalid id', async () => {
    const invalidIds = ['', '   ', null, 123, {}, []];

    for (const id of invalidIds) {
      const request = { id: id, userId: vp.userId };

      // @ts-expect-error Testing invalid types
      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );
    }
  });

  it('should not affect other recipes when deleting one', async () => {
    const secondRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      id: 'second-recipe-id',
      ingredientLines: testRecipe.ingredientLines,
    });

    await recipesRepo.saveRecipe(testRecipe);
    await recipesRepo.saveRecipe(secondRecipe);

    const request = { id: testRecipe.id, userId: vp.userId };
    await deleteRecipeUsecase.execute(request);

    const remainingRecipe = await recipesRepo.getRecipeById(secondRecipe.id);
    expect(remainingRecipe).toEqual(secondRecipe);

    const deletedRecipe = await recipesRepo.getRecipeById(testRecipe.id);
    expect(deletedRecipe).toBeNull();
  });

  it('should throw ValidationError for invalid userId', async () => {
    const invalidUserIds = ['', '   ', null, 123, {}, []];

    for (const userId of invalidUserIds) {
      const request = { id: testRecipe.id, userId: userId };

      // @ts-expect-error Testing invalid types
      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );
    }
  });
});
