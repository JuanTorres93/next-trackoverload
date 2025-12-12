import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetRecipeByIdForUserUsecase } from '../GetRecipeByIdForUser.usecase';

describe('GetRecipeByIdForUserUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;
  let getRecipeByIdUsecase: GetRecipeByIdForUserUsecase;
  let testRecipe: Recipe;
  let user: User;

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    usersRepo = new MemoryUsersRepo();
    getRecipeByIdUsecase = new GetRecipeByIdForUserUsecase(
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

    testRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });
  });

  describe('Execution', () => {
    it('should return recipe when it exists', async () => {
      await recipesRepo.saveRecipe(testRecipe);

      const request = { id: testRecipe.id, userId: vp.userId };
      const result = await getRecipeByIdUsecase.execute(request);

      expect(result).toEqual(toRecipeDTO(testRecipe));
    });

    it('should return RecipeDTO', async () => {
      await recipesRepo.saveRecipe(testRecipe);

      const request = { id: testRecipe.id, userId: vp.userId };
      const result = await getRecipeByIdUsecase.execute(request);

      expect(result).not.toBeInstanceOf(Recipe);
      for (const prop of dto.recipeDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should return null when recipe does not exist', async () => {
      const request = { id: 'non-existent-id', userId: vp.userId };
      const result = await getRecipeByIdUsecase.execute(request);

      expect(result).toBeNull();
    });
  });

  describe('Error', () => {
    it('should throw error if user does not exist', async () => {
      await expect(
        getRecipeByIdUsecase.execute({ id: 'some-id', userId: 'non-existent' })
      ).rejects.toThrow(NotFoundError);
      await expect(
        getRecipeByIdUsecase.execute({ id: 'some-id', userId: 'non-existent' })
      ).rejects.toThrow(/GetRecipeByIdForUserUsecase.*user.*not.*found/);
    });
  });
});
