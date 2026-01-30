import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateRecipeUsecase } from '../UpdateRecipe.usecase';

describe('UpdateRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;
  let updateRecipeUsecase: UpdateRecipeUsecase;
  let testRecipe: Recipe;
  let user: User;

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    usersRepo = new MemoryUsersRepo();
    updateRecipeUsecase = new UpdateRecipeUsecase(recipesRepo, usersRepo);

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await usersRepo.saveUser(user);

    const testIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
    });

    const testIngredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
    });

    testRecipe = Recipe.create({
      ...recipeTestProps.recipePropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });
    await recipesRepo.saveRecipe(testRecipe);
  });

  describe('Execute', () => {
    it('should update recipe name successfully', async () => {
      const originalUpdatedAt = testRecipe.updatedAt;

      // Wait a moment to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 2));

      const request = {
        id: testRecipe.id,
        name: 'Updated Grilled Chicken',
        userId: userTestProps.userId,
      };

      const result = await updateRecipeUsecase.execute(request);

      expect(result.name).toBe('Updated Grilled Chicken');
      expect(result.id).toBe(testRecipe.id);
      expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });

    it('should return RecipeDTO', async () => {
      const request = {
        id: testRecipe.id,
        name: 'Updated Name',
        userId: userTestProps.userId,
      };

      const result = await updateRecipeUsecase.execute(request);

      expect(result).not.toBeInstanceOf(Recipe);
      for (const prop of dto.recipeDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when recipe does not exist', async () => {
      const request = {
        id: 'non-existent-id',
        name: 'Updated Name',
        userId: userTestProps.userId,
      };

      await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
        /UpdateRecipeUsecase.*Recipe.*not.*found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        id: 'some-id',
        userId: 'non-existent',
      };

      await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );
      await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
        /UpdateRecipeUsecase.*user.*not.*found/,
      );
    });

    it("should throw error if trying to modify another user's recipe", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        id: testRecipe.id,
        name: 'Updated Name',
        userId: anotherUser.id,
      };

      await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );
      await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
        /UpdateRecipeUsecase.*Recipe.*not.*found/,
      );
    });
  });
});
