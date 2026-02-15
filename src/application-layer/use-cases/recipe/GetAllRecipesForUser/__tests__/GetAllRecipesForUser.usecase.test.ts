import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { GetAllRecipesForUserUsecase } from '../GetAllRecipesForUser.usecase';

describe('GetAllRecipesForUserUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;
  let getAllRecipesUsecase: GetAllRecipesForUserUsecase;
  let testRecipes: Recipe[];
  let user1: User;
  let user2: User;
  const userId1 = userTestProps.userId;
  const userId2 = 'user-2';

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    usersRepo = new MemoryUsersRepo();
    getAllRecipesUsecase = new GetAllRecipesForUserUsecase(
      recipesRepo,
      usersRepo,
    );

    user1 = userTestProps.createTestUser();

    user2 = userTestProps.createTestUser({
      id: userId2,
    });

    testRecipes = [
      recipeTestProps.createTestRecipe({}, 1),
      recipeTestProps.createTestRecipe(
        {
          id: 'recipe2',
        },
        2,
      ),
    ];

    for (const recipe of testRecipes) {
      await recipesRepo.saveRecipe(recipe);
    }
    await usersRepo.saveUser(user1);
    await usersRepo.saveUser(user2);
  });

  describe('Execution', () => {
    it('should return all recipes when they exist', async () => {
      const result = await getAllRecipesUsecase.execute({
        actorUserId: userId1,
        targetUserId: userId1,
      });

      const recipeIds = result.map((r) => r.id);

      expect(result).toHaveLength(2);
      expect(recipeIds).toContain(testRecipes[0].id);
      expect(recipeIds).toContain(testRecipes[1].id);
    });

    it('should return an array of RecipeDTO', async () => {
      const result = await getAllRecipesUsecase.execute({
        actorUserId: userId1,
        targetUserId: userId1,
      });

      expect(result).toHaveLength(2);

      for (const recipe of result) {
        expect(recipe).not.toBeInstanceOf(Recipe);

        for (const prop of dto.recipeDTOProperties) {
          expect(recipe).toHaveProperty(prop);
        }
      }
    });

    it('should return empty array when no recipes exist', async () => {
      recipesRepo.clearForTesting();

      const result = await getAllRecipesUsecase.execute({
        actorUserId: userId1,
        targetUserId: userId1,
      });

      expect(result).toEqual([]);
    });

    it('should return only recipes for the specified user', async () => {
      const user2Recipe = recipeTestProps.createTestRecipe({
        id: 'user-2-recipe',
        userId: userId2,
      });

      await recipesRepo.saveRecipe(user2Recipe);

      // Get recipes for user1
      const user1Recipes = await getAllRecipesUsecase.execute({
        actorUserId: userId1,
        targetUserId: userId1,
      });
      expect(user1Recipes).toHaveLength(2);
      expect(user1Recipes.every((r) => r.userId === userId1)).toBe(true);

      // Get recipes for user2
      const user2Recipes = await getAllRecipesUsecase.execute({
        actorUserId: userId2,
        targetUserId: userId2,
      });
      expect(user2Recipes).toHaveLength(1);
      expect(user2Recipes[0].userId).toBe(userId2);
    });

    it("should return empty array when trying to get another user's recipes", async () => {
      const result = await getAllRecipesUsecase.execute({
        actorUserId: userId2,
        targetUserId: userId2,
      });

      expect(result).toEqual([]);
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        actorUserId: 'non-existent',
        targetUserId: 'non-existent',
      };

      await expect(getAllRecipesUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );
      await expect(getAllRecipesUsecase.execute(request)).rejects.toThrow(
        /GetAllRecipesForUserUsecase.*user.*not.*found/,
      );
    });

    it('should throw error when trying to get another users recipes', async () => {
      const request = {
        actorUserId: userId1,
        targetUserId: userId2,
      };

      await expect(getAllRecipesUsecase.execute(request)).rejects.toThrow(
        PermissionError,
      );

      await expect(getAllRecipesUsecase.execute(request)).rejects.toThrow(
        /GetAllRecipesForUserUsecase.*cannot.*get.*recipes.*another user/,
      );
    });
  });
});
