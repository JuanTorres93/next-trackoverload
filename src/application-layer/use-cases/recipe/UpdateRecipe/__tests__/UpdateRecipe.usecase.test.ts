import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
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

  it('should update recipe name successfully', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalUpdatedAt = testRecipe.updatedAt;

    // Wait a moment to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 2));

    const request = {
      id: testRecipe.id,
      name: 'Updated Grilled Chicken',
      userId: vp.userId,
    };

    const result = await updateRecipeUsecase.execute(request);

    expect(result.name).toBe('Updated Grilled Chicken');
    expect(result.id).toBe(testRecipe.id);
    expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });

  it('should throw NotFoundError when recipe does not exist', async () => {
    const request = {
      id: 'non-existent-id',
      name: 'Updated Name',
      userId: vp.userId,
    };

    await expect(updateRecipeUsecase.execute(request)).rejects.toThrow(
      NotFoundError
    );
  });

  it('should not update when no changes provided', async () => {
    await recipesRepo.saveRecipe(testRecipe);
    const originalUpdatedAt = testRecipe.updatedAt;

    const request = {
      userId: vp.userId,
      id: testRecipe.id,
    };

    const result = await updateRecipeUsecase.execute(request);

    expect(result.name).toBe(testRecipe.name);
    expect(result.updatedAt).toEqual(originalUpdatedAt.toISOString());
  });

  it('should return RecipeDTO', async () => {
    await recipesRepo.saveRecipe(testRecipe);

    const request = {
      id: testRecipe.id,
      name: 'Updated Name',
      userId: vp.userId,
    };

    const result = await updateRecipeUsecase.execute(request);

    expect(result).not.toBeInstanceOf(Recipe);
    for (const prop of dto.recipeDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      updateRecipeUsecase.execute({
        id: 'some-id',
        userId: 'non-existent',
      })
    ).rejects.toThrow(NotFoundError);
    await expect(
      updateRecipeUsecase.execute({
        id: 'some-id',
        userId: 'non-existent',
      })
    ).rejects.toThrow(/UpdateRecipeUsecase.*user.*not.*found/);
  });
});
