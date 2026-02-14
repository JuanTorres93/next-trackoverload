import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { RemoveIngredientFromRecipeUsecase } from '../RemoveIngredientFromRecipe.usecase';

import * as dto from '@/../tests/dtoProperties';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';

describe('RemoveIngredientFromRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;
  let removeIngredientFromRecipeUsecase: RemoveIngredientFromRecipeUsecase;
  let testRecipe: Recipe;
  let testIngredient: Ingredient;
  let user: User;

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    usersRepo = new MemoryUsersRepo();
    removeIngredientFromRecipeUsecase = new RemoveIngredientFromRecipeUsecase(
      recipesRepo,
      usersRepo,
    );

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await usersRepo.saveUser(user);

    testRecipe = recipeTestProps.createTestRecipe({}, 2);
    testIngredient = testRecipe.ingredientLines[0].ingredient;

    await recipesRepo.saveRecipe(testRecipe);
  });

  describe('Execute', () => {
    it('should remove ingredient from recipe successfully', async () => {
      const originalIngredientCount = testRecipe.ingredientLines.length;
      const firstIngredientId = testRecipe.ingredientLines[0].ingredient.id;
      const secondIngredientId = testRecipe.ingredientLines[1].ingredient.id;

      const request = {
        recipeId: testRecipe.id,
        ingredientId: firstIngredientId,
        userId: userTestProps.userId,
      };

      const result = await removeIngredientFromRecipeUsecase.execute(request);

      // Expect to have one ingredient less
      expect(result.ingredientLines).toHaveLength(originalIngredientCount - 1);

      // Expect the removed ingredient to no longer be in the recipe
      expect(
        result.ingredientLines.some(
          (line) => line.ingredient.id === firstIngredientId,
        ),
      ).toBe(false);

      // Expect the other ingredient to still be in the recipe
      expect(
        result.ingredientLines.some(
          (line) => line.ingredient.id === secondIngredientId,
        ),
      ).toBe(true);
    });

    it('should return RecipeDTO', async () => {
      const request = {
        recipeId: testRecipe.id,
        ingredientId: testIngredient.id,
        userId: userTestProps.userId,
      };

      const result = await removeIngredientFromRecipeUsecase.execute(request);

      expect(result).not.toBeInstanceOf(Recipe);
      for (const prop of dto.recipeDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when recipe does not exist', async () => {
      const request = {
        recipeId: 'non-existent-id',
        ingredientId: testIngredient.id,
        userId: userTestProps.userId,
      };

      await expect(
        removeIngredientFromRecipeUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        removeIngredientFromRecipeUsecase.execute(request),
      ).rejects.toThrow(
        /RemoveIngredientFromRecipeUsecase.*Recipe.*not.*found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        recipeId: 'some-id',
        userId: 'non-existent',
        ingredientId: 'ingredient-id',
      };

      await expect(
        removeIngredientFromRecipeUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);
      await expect(
        removeIngredientFromRecipeUsecase.execute(request),
      ).rejects.toThrow(/RemoveIngredientFromRecipeUsecase.*user.*not.*found/);
    });

    it("should throw error if trying to delete another user's recipe", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        recipeId: testRecipe.id,
        ingredientId: testIngredient.id,
        userId: anotherUser.id,
      };

      await expect(
        removeIngredientFromRecipeUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);
      await expect(
        removeIngredientFromRecipeUsecase.execute(request),
      ).rejects.toThrow(
        /RemoveIngredientFromRecipeUsecase.*Recipe.*not.*found/,
      );
    });
  });
});
