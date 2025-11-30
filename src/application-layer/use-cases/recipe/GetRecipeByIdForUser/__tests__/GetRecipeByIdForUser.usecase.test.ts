import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetRecipeByIdForUserUsecase } from '../GetRecipeByIdForUser.usecase';

describe('GetRecipeByIdForUserUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let getRecipeByIdUsecase: GetRecipeByIdForUserUsecase;
  let testRecipe: Recipe;

  beforeEach(() => {
    recipesRepo = new MemoryRecipesRepo();
    getRecipeByIdUsecase = new GetRecipeByIdForUserUsecase(recipesRepo);

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
