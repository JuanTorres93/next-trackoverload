import * as vp from '@/../tests/createProps';
import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryImageManager } from '@/infra';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator';
import { createTestImage } from '../../../../../../tests/helpers/imageTestHelpers';
import { DeleteRecipeUsecase } from '../DeleteRecipe.usecase';

describe('DeleteRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let memoryImageManager: MemoryImageManager;
  let usersRepo: MemoryUsersRepo;
  let deleteRecipeUsecase: DeleteRecipeUsecase;
  let testRecipe: Recipe;
  let user: User;

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    memoryImageManager = new MemoryImageManager(
      '/memory/images/',
      new Uuidv4IdGenerator()
    );
    usersRepo = new MemoryUsersRepo();
    deleteRecipeUsecase = new DeleteRecipeUsecase(
      recipesRepo,
      memoryImageManager,
      usersRepo
    );

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);

    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
    });

    testRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });
    await recipesRepo.saveRecipe(testRecipe);
  });

  describe('Deletion', () => {
    it('should delete recipe successfully', async () => {
      const request = { id: testRecipe.id, userId: vp.userId };
      await deleteRecipeUsecase.execute(request);

      const deletedRecipe = await recipesRepo.getRecipeById(testRecipe.id);
      expect(deletedRecipe).toBeNull();
    });
  });

  describe('Side effects', () => {
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

      const afterDeleteImages = memoryImageManager.getImageCount();
      expect(afterDeleteImages).toBe(0);
    });

    it('should not affect other recipes when deleting one', async () => {
      const secondRecipe = Recipe.create({
        ...vp.recipePropsNoIngredientLines,
        id: 'second-recipe-id',
        ingredientLines: testRecipe.ingredientLines,
      });

      await recipesRepo.saveRecipe(secondRecipe);

      const request = { id: testRecipe.id, userId: vp.userId };
      await deleteRecipeUsecase.execute(request);

      const remainingRecipe = await recipesRepo.getRecipeById(secondRecipe.id);
      expect(remainingRecipe).toEqual(secondRecipe);

      const deletedRecipe = await recipesRepo.getRecipeById(testRecipe.id);
      expect(deletedRecipe).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when recipe does not exist', async () => {
      const request = { id: 'non-existent-id', userId: vp.userId };

      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );

      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        /DeleteRecipeUsecase.*Recipe.*not.*found/
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = { id: 'some-id', userId: 'non-existent' };

      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );
      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        /DeleteRecipeUsecase.*user.*not.*found/
      );
    });

    it("should throw error when trying to delete another user's recipe", async () => {
      const anotherUser = User.create({
        ...vp.validUserProps,
        id: 'another-user-id',
        email: 'anotheruser@example.com',
      });
      await usersRepo.saveUser(anotherUser);

      const request = { id: testRecipe.id, userId: anotherUser.id };

      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );
      await expect(deleteRecipeUsecase.execute(request)).rejects.toThrow(
        /DeleteRecipeUsecase.*Recipe.*not.*found/
      );
    });
  });
});
