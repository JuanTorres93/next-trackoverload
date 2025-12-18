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
    await recipesRepo.saveRecipe(testRecipe);
  });

  describe('Execution', () => {
    it('should return recipe when it exists', async () => {
      const request = { id: testRecipe.id, userId: vp.userId };
      const result = await getRecipeByIdUsecase.execute(request);

      expect(result).toEqual(toRecipeDTO(testRecipe));
    });

    it('should return RecipeDTO', async () => {
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

    it("should return null when trying to get another user's recipe", async () => {
      const anotherUser = User.create({
        ...vp.validUserProps,
        id: 'another-user-id',
      });
      await usersRepo.saveUser(anotherUser);

      const request = { id: testRecipe.id, userId: anotherUser.id };
      const result = await getRecipeByIdUsecase.execute(request);

      expect(result).toBeNull();
    });
  });

  describe('Error', () => {
    it('should throw error if user does not exist', async () => {
      const request = { id: 'some-id', userId: 'non-existent' };

      await expect(getRecipeByIdUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );
      await expect(getRecipeByIdUsecase.execute(request)).rejects.toThrow(
        /GetRecipeByIdForUserUsecase.*user.*not.*found/
      );
    });
  });
});
