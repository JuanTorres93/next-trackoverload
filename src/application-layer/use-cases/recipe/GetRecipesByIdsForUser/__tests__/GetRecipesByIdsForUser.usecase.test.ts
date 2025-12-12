import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
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

    testRecipes = [
      Recipe.create({
        ...vp.recipePropsNoIngredientLines,
        ingredientLines: [testIngredientLine],
      }),
      Recipe.create({
        ...vp.recipePropsNoIngredientLines,
        id: 'recipe2',
        ingredientLines: [testIngredientLine],
      }),
    ];
  });

  describe('Execution', () => {
    it('should return recipes for valid ids', async () => {
      for (const recipe of testRecipes) {
        await recipesRepo.saveRecipe(recipe);
      }

      const request = {
        ids: [testRecipes[0].id, testRecipes[1].id],
        userId: vp.userId,
      };

      const result = await getRecipesByIdsUsecase.execute(request);

      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining(testRecipes.map(toRecipeDTO))
      );
    });

    it('should return an array of RecipeDTOs', async () => {
      for (const recipe of testRecipes) {
        await recipesRepo.saveRecipe(recipe);
      }

      const request = {
        ids: [testRecipes[0].id, testRecipes[1].id],
        userId: vp.userId,
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
      await recipesRepo.saveRecipe(testRecipes[0]);

      const request = {
        ids: [testRecipes[0].id, 'non-existent-id'],
        userId: vp.userId,
      };

      const result = await getRecipesByIdsUsecase.execute(request);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(toRecipeDTO(testRecipes[0]));
    });

    it('should return empty array for all non-existent ids', async () => {
      // NOTE: this test will change to throw ValidationError
      const request = {
        ids: ['non-existent-1', 'non-existent-2'],
        userId: vp.userId,
      };

      const result = await getRecipesByIdsUsecase.execute(request);

      expect(result).toEqual([]);
    });

    it('should handle duplicate ids gracefully', async () => {
      await recipesRepo.saveRecipe(testRecipes[0]);

      const request = {
        ids: [testRecipes[0].id, testRecipes[0].id],
        userId: vp.userId,
      };

      const result = await getRecipesByIdsUsecase.execute(request);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(toRecipeDTO(testRecipes[0]));
    });
  });

  describe('Errors', () => {
    it('should throw ValidationError for empty ids array', async () => {
      const request = { ids: [], userId: vp.userId };

      await expect(getRecipesByIdsUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );

      await expect(getRecipesByIdsUsecase.execute(request)).rejects.toThrow(
        /GetRecipesByIdsForUserUsecase.*ids.*non-empty array/
      );
    });

    it('should throw error if user does not exist', async () => {
      await expect(
        getRecipesByIdsUsecase.execute({
          ids: ['some-id'],
          userId: 'non-existent',
        })
      ).rejects.toThrow(NotFoundError);
      await expect(
        getRecipesByIdsUsecase.execute({
          ids: ['some-id'],
          userId: 'non-existent',
        })
      ).rejects.toThrow(/GetRecipesByIdsForUserUsecase.*user.*not.*found/);
    });
  });
});
