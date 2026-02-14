import { NotFoundError } from '@/domain/common/errors';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { ImageType } from '@/domain/repos/ImagesRepo.port';
import { MemoryImagesRepo } from '@/infra/repos/memory/MemoryImagesRepo';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { createTestImage } from '../../../../../../tests/helpers/imageTestHelpers';
import { DeleteRecipeUsecase } from '../DeleteRecipe.usecase';

describe('DeleteRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let memoryImagesRepo: MemoryImagesRepo;
  let usersRepo: MemoryUsersRepo;
  let deleteRecipeUsecase: DeleteRecipeUsecase;
  let testRecipe: Recipe;
  let user: User;

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    memoryImagesRepo = new MemoryImagesRepo();
    usersRepo = new MemoryUsersRepo();

    deleteRecipeUsecase = new DeleteRecipeUsecase(
      recipesRepo,
      memoryImagesRepo,
      usersRepo,
    );

    user = User.create({
      ...userTestProps.validUserProps,
    });

    testRecipe = recipeTestProps.createTestRecipe({}, 1);

    await usersRepo.saveUser(user);
    await recipesRepo.saveRecipe(testRecipe);
  });

  describe('Deletion', () => {
    it('should delete recipe successfully', async () => {
      const request = { id: testRecipe.id, userId: userTestProps.userId };
      await deleteRecipeUsecase.execute(request);

      const deletedRecipe = await recipesRepo.getRecipeById(testRecipe.id);
      expect(deletedRecipe).toBeNull();
    });
  });

  describe('Side effects', () => {
    it('should delete recipe image if exists', async () => {
      const testImage = await createTestImage();
      const metadata: ImageType['metadata'] = {
        url: 'http://example.com/test-image.png',
        filename: 'test-image.png',
        mimeType: 'image/png',
        sizeBytes: testImage.length,
      };

      const uploadedImage = await memoryImagesRepo.save({
        buffer: testImage,
        metadata,
      });

      const recipe = recipeTestProps.createTestRecipe({
        imageUrl: uploadedImage.url,
      });

      expect(recipe.imageUrl).toBeDefined();
      const currentImages = memoryImagesRepo.countForTesting();
      expect(currentImages).toBe(1);

      await recipesRepo.saveRecipe(recipe);

      const request = { id: recipe.id, userId: userTestProps.userId };
      await deleteRecipeUsecase.execute(request);

      const afterDeleteImages = memoryImagesRepo.countForTesting();
      expect(afterDeleteImages).toBe(0);
    });

    it('should not affect other recipes when deleting one', async () => {
      const secondRecipe = recipeTestProps.createTestRecipe({
        id: 'second-recipe-id',
        ingredientLines: testRecipe.ingredientLines,
      });

      await recipesRepo.saveRecipe(secondRecipe);

      const request = { id: testRecipe.id, userId: userTestProps.userId };
      await deleteRecipeUsecase.execute(request);

      const remainingRecipe = await recipesRepo.getRecipeById(secondRecipe.id);
      expect(remainingRecipe).toEqual(secondRecipe);

      const deletedRecipe = await recipesRepo.getRecipeById(testRecipe.id);
      expect(deletedRecipe).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when recipe does not exist', async () => {
      const request = { id: 'non-existent-id', userId: userTestProps.userId };

      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        /DeleteRecipeUsecase.*Recipe.*not.*found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = { id: 'some-id', userId: 'non-existent' };

      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );
      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        /DeleteRecipeUsecase.*user.*not.*found/,
      );
    });

    it("should throw error when trying to delete another user's recipe", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
        email: 'anotheruser@example.com',
      });
      await usersRepo.saveUser(anotherUser);

      const request = { id: testRecipe.id, userId: anotherUser.id };

      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );
      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        /DeleteRecipeUsecase.*Recipe.*not.*found/,
      );
    });
  });
});
