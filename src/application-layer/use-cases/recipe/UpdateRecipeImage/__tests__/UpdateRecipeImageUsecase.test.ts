import { NotFoundError } from '@/domain/common/errors';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryImagesRepo } from '@/infra/repos/memory/MemoryImagesRepo';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { SharpServerImageProcessor } from '@/infra/services/ImageProcessor/ServerImageProcessor/SharpServerImageProcessor/SharpServerImageProcessor';
import { createTestImage } from '../../../../../../tests/helpers/imageTestHelpers';
import { UpdateRecipeImageUsecase } from '../UpdateRecipeImageUsecase';

import * as vp from '@/../tests/createProps';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';

describe('UpdateRecipeImageUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let imagesRepo: MemoryImagesRepo;
  let imageProcessor: SharpServerImageProcessor;

  let usecase: UpdateRecipeImageUsecase;

  let recipe: Recipe;
  let testImageBuffer: Buffer;

  beforeAll(async () => {
    testImageBuffer = await createTestImage('small');
  });

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    imagesRepo = new MemoryImagesRepo();
    imageProcessor = new SharpServerImageProcessor();

    usecase = new UpdateRecipeImageUsecase(
      recipesRepo,
      imagesRepo,
      imageProcessor,
    );

    recipe = Recipe.create({
      ...recipeTestProps.validRecipePropsWithIngredientLines(),
      userId: userTestProps.userId,
    });

    await recipesRepo.saveRecipe(recipe);
  });

  describe('Execution', () => {
    it('should return RecipeDTO', async () => {
      const result = await usecase.execute({
        recipeId: recipe.id,
        userId: userTestProps.userId,
        imageData: testImageBuffer,
      });

      expect(result).not.toBeInstanceOf(Recipe);
      for (const prop of dto.recipeDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should update recipe imageUrl', async () => {
      const oldImageUrl = recipe.imageUrl;

      expect(oldImageUrl).not.toBeDefined();

      const result = await usecase.execute({
        recipeId: recipe.id,
        userId: userTestProps.userId,
        imageData: testImageBuffer,
      });

      expect(result!.imageUrl).toBeDefined();
    });

    it('should not keep same url for different images', async () => {
      // If url was the same, browser would cache old image and not show inmediately the new one
      const result1 = await usecase.execute({
        recipeId: recipe.id,
        userId: userTestProps.userId,
        imageData: testImageBuffer,
      });

      const firstImageUrl = result1!.imageUrl;

      const result2 = await usecase.execute({
        recipeId: recipe.id,
        userId: userTestProps.userId,
        imageData: await createTestImage('small'),
      });

      const secondImageUrl = result2!.imageUrl;

      expect(secondImageUrl).toBeDefined();
      expect(secondImageUrl).not.toBe(firstImageUrl);
    });

    it('should replace existing image', async () => {
      // First upload
      await usecase.execute({
        recipeId: recipe.id,
        userId: userTestProps.userId,
        imageData: testImageBuffer,
      });

      const firstRecipeWithImage = await recipesRepo.getRecipeByIdAndUserId(
        recipe.id,
        userTestProps.userId,
      );
      const firstUrl = firstRecipeWithImage!.imageUrl;

      // Wait a bit to ensure different timestamp for URL generation
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Second upload
      await usecase.execute({
        recipeId: recipe.id,
        userId: userTestProps.userId,
        imageData: testImageBuffer,
      });

      const secondRecipeWithImage = await recipesRepo.getRecipeByIdAndUserId(
        recipe.id,
        userTestProps.userId,
      );
      const secundUrl = secondRecipeWithImage!.imageUrl;

      expect(firstUrl).toBeDefined();

      expect(secundUrl).toBeDefined();

      expect(secundUrl).not.toBe(firstUrl);
    });
  });

  describe('Side effects', () => {
    it('Stores new image', async () => {
      const initialImages = imagesRepo.countForTesting();
      expect(initialImages).toBe(0);

      await usecase.execute({
        recipeId: recipe.id,
        userId: userTestProps.userId,
        imageData: testImageBuffer,
      });

      const finalImages = imagesRepo.countForTesting();
      expect(finalImages).toBe(1);
    });
    // TODO: old image deleted
  });

  describe('Errors', () => {
    it('should throw NotFoundError if recipe does not exist', async () => {
      const request = {
        recipeId: 'non-existent-recipe-id',
        userId: userTestProps.userId,
        imageData: testImageBuffer,
      };

      await expect(usecase.execute(request)).rejects.toThrowError(
        NotFoundError,
      );

      await expect(usecase.execute(request)).rejects.toThrowError(
        /UpdateRecipeImageUsecase: Recipe.*not found/,
      );
    });

    it("should throw error if trying to update image in another user's recipe", async () => {
      const request = {
        recipeId: recipe.id,
        userId: 'another-user-id',
        imageData: testImageBuffer,
      };

      await expect(usecase.execute(request)).rejects.toThrowError(
        NotFoundError,
      );
      await expect(usecase.execute(request)).rejects.toThrowError(
        /UpdateRecipeImageUsecase: Recipe.*not found/,
      );
    });
  });
});
