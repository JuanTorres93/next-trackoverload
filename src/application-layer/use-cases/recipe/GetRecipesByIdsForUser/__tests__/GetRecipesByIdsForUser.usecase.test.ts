import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetRecipesByIdsForUserUsecase } from '../GetRecipesByIdsForUser.usecase';

describe('GetRecipesByIdsForUserUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;
  let getRecipesByIdsUsecase: GetRecipesByIdsForUserUsecase;
  let testRecipes: Recipe[];
  let user: User;

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    usersRepo = new MemoryUsersRepo();
    getRecipesByIdsUsecase = new GetRecipesByIdsForUserUsecase(
      recipesRepo,
      usersRepo,
    );

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

    testRecipes = [
      Recipe.create({
        ...recipeTestProps.recipePropsNoIngredientLines,
        ingredientLines: [testIngredientLine],
      }),
      Recipe.create({
        ...recipeTestProps.recipePropsNoIngredientLines,
        id: 'recipe2',
        ingredientLines: [testIngredientLine],
      }),
    ];

    for (const recipe of testRecipes) {
      await recipesRepo.saveRecipe(recipe);
    }
  });

  describe('Execution', () => {
    it('should return recipes for valid ids', async () => {
      const request = {
        ids: [testRecipes[0].id, testRecipes[1].id],
        userId: userTestProps.userId,
      };

      const result = await getRecipesByIdsUsecase.execute(request);

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining(testRecipes.map(toRecipeDTO)),
      );
    });

    it('should return an array of RecipeDTOs', async () => {
      const request = {
        ids: [testRecipes[0].id, testRecipes[1].id],
        userId: userTestProps.userId,
      };

      const result = await getRecipesByIdsUsecase.execute(request);

      for (const recipe of result) {
        expect(recipe).not.toBeInstanceOf(Recipe);

        for (const prop of dto.recipeDTOProperties) {
          expect(recipe).toHaveProperty(prop);
        }
      }
    });

    it('should filter out non-existent recipes', async () => {
      const request = {
        ids: [testRecipes[0].id, 'non-existent-id'],
        userId: userTestProps.userId,
      };

      const result = await getRecipesByIdsUsecase.execute(request);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(toRecipeDTO(testRecipes[0]));
    });

    it('should return empty array for non-existent ids', async () => {
      const request = {
        ids: ['non-existent-1', 'non-existent-2'],
        userId: userTestProps.userId,
      };

      const result = await getRecipesByIdsUsecase.execute(request);

      expect(result).toEqual([]);
    });

    it('should return one result when id is duplicated', async () => {
      const request = {
        ids: [testRecipes[0].id, testRecipes[0].id],
        userId: userTestProps.userId,
      };

      const result = await getRecipesByIdsUsecase.execute(request);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(toRecipeDTO(testRecipes[0]));
    });

    it("should return empty array when trying to get another user's recipes", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        ids: [testRecipes[0].id, testRecipes[1].id],
        userId: anotherUser.id,
      };

      const result = await getRecipesByIdsUsecase.execute(request);

      expect(result).toEqual([]);
    });
  });

  describe('Errors', () => {
    it('should throw ValidationError for empty ids array', async () => {
      const request = { ids: [], userId: userTestProps.userId };

      await expect(getRecipesByIdsUsecase.execute(request)).rejects.toThrow(
        ValidationError,
      );

      await expect(getRecipesByIdsUsecase.execute(request)).rejects.toThrow(
        /GetRecipesByIdsForUserUsecase.*ids.*non-empty array/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        ids: ['some-id'],
        userId: 'non-existent',
      };

      await expect(getRecipesByIdsUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );
      await expect(getRecipesByIdsUsecase.execute(request)).rejects.toThrow(
        /GetRecipesByIdsForUserUsecase.*user.*not.*found/,
      );
    });
  });
});
