import { NotFoundError } from '@/domain/common/errors';
import { UpdateRecipeImageUsecase } from '../UpdateRecipeImageUsecase';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryImageManager } from '@/infra';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator';
import { createTestImage } from '../../../../../../tests/helpers/imageTestHelpers';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('UpdateRecipeImageUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let imageManager: MemoryImageManager;
  let usecase: UpdateRecipeImageUsecase;

  let recipe: Recipe;
  let testImageBuffer: Buffer;

  beforeAll(async () => {
    testImageBuffer = createTestImage('small');
  });

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    imageManager = new MemoryImageManager(
      '/memory/images',
      new Uuidv4IdGenerator()
    );
    usecase = new UpdateRecipeImageUsecase(recipesRepo, imageManager);

    recipe = Recipe.create({
      ...vp.validRecipePropsWithIngredientLines(),
      userId: vp.userId,
    });

    await recipesRepo.saveRecipe(recipe);
  });

  describe('Execution', () => {
    it('should return RecipeDTO', async () => {
      const result = await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
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
        userId: vp.userId,
        imageData: testImageBuffer,
      });

      expect(result!.imageUrl).toBeDefined();
    });

    it('should keep same url for different images', async () => {
      const result1 = await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
        imageData: testImageBuffer,
      });

      const firstImageUrl = result1!.imageUrl;

      const result2 = await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
        imageData: createTestImage('small'),
      });

      const secondImageUrl = result2!.imageUrl;

      expect(secondImageUrl).toBeDefined();
      expect(secondImageUrl).toBe(firstImageUrl);
    });

    it('should replace existing image', async () => {
      // First upload
      const firstResult = await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
        imageData: testImageBuffer,
      });

      const firstImageUrl = firstResult!.imageUrl;

      // Second upload
      const secondResult = await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
        imageData: testImageBuffer,
      });

      const secondImageUrl = secondResult!.imageUrl;

      expect(secondImageUrl).toBeDefined();
      expect(secondImageUrl).not.toBe(firstImageUrl);
    });
  });

  describe('Side effects', () => {
    it('Stores new image', async () => {
      const initialImages = imageManager.getImageCount();
      expect(initialImages).toBe(0);

      await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
        imageData: testImageBuffer,
      });

      const finalImages = imageManager.getImageCount();
      expect(finalImages).toBe(1);
    });
    // TODO: old image deleted
  });

  describe('Errors', () => {
    it('should throw NotFoundError if recipe does not exist', async () => {
      await expect(
        usecase.execute({
          recipeId: 'non-existent-recipe-id',
          userId: vp.userId,
          imageData: testImageBuffer,
        })
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
