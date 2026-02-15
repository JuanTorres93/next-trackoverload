import * as dto from '@/../tests/dtoProperties';
import { AuthError, NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryIngredientsRepo } from '@/infra/repos/memory/MemoryIngredientsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as mealTestProps from '../../../../../../tests/createProps/mealTestProps';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { UpdateIngredientLineUsecase } from '../UpdateIngredientLine.usecase';

describe('UpdateIngredientLineUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let recipesRepo: MemoryRecipesRepo;
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let updateIngredientLineUsecase: UpdateIngredientLineUsecase;
  let testIngredientLine: IngredientLine;
  let alternativeIngredient: Ingredient;
  let testRecipe: Recipe;
  let testMeal: Meal;
  let user: User;
  let anotherUser: User;

  const anotherUserId = 'another-user-id';

  beforeEach(async () => {
    ingredientsRepo = new MemoryIngredientsRepo();
    recipesRepo = new MemoryRecipesRepo();
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    updateIngredientLineUsecase = new UpdateIngredientLineUsecase(
      ingredientsRepo,
      recipesRepo,
      mealsRepo,
      usersRepo,
    );

    user = User.create({
      ...userTestProps.validUserProps,
    });
    anotherUser = User.create({
      ...userTestProps.validUserProps,
      id: anotherUserId,
    });

    alternativeIngredient = ingredientTestProps.createTestIngredient({
      id: 'alternative-ingredient-id',
      name: 'Turkey Breast',
    });

    testRecipe = recipeTestProps.createTestRecipe({}, 1);
    testIngredientLine = [...testRecipe.ingredientLines][0];

    testMeal = mealTestProps.createTestMeal();

    // Save entities to repos
    await usersRepo.saveUser(user);
    await usersRepo.saveUser(anotherUser);
    await ingredientsRepo.saveIngredient(alternativeIngredient);
    await recipesRepo.saveRecipe(testRecipe);
    await mealsRepo.saveMeal(testMeal);
  });

  describe('Recipe line', () => {
    describe('Updated', () => {
      it('should update only the quantity when quantityInGrams is provided for recipe', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'recipe' as const,
          parentEntityId: testRecipe.id,
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 300,
        };

        const result = await updateIngredientLineUsecase.execute(request);

        expect(result.quantityInGrams).toBe(300);
        expect(result.ingredient.id).toBe(
          testRecipe.ingredientLines[0].ingredient.id,
        );
        expect(result.ingredient.name).toBe('Chicken Breast');
        expect(result.id).toBe(testIngredientLine.id);
      });

      it('should return IngredientLineDTO', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'recipe' as const,
          parentEntityId: testRecipe.id,
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 300,
        };

        const result = await updateIngredientLineUsecase.execute(request);

        expect(result).not.toBeInstanceOf(IngredientLine);
        for (const prop of dto.ingredientLineDTOProperties) {
          expect(result).toHaveProperty(prop);
        }
      });

      it('should update only the ingredient when ingredientId is provided', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'recipe' as const,
          parentEntityId: testRecipe.id,
          ingredientLineId: testIngredientLine.id,
          ingredientId: alternativeIngredient.id,
        };

        const result = await updateIngredientLineUsecase.execute(request);

        expect(result.ingredient.id).toBe(alternativeIngredient.id);
        expect(result.ingredient.name).toBe('Turkey Breast');
        expect(result.quantityInGrams).toBe(200);
        expect(result.id).toBe(testIngredientLine.id);
      });

      it('should update both ingredient and quantity when both are provided', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'recipe' as const,
          parentEntityId: testRecipe.id,
          ingredientLineId: testIngredientLine.id,
          ingredientId: alternativeIngredient.id,
          quantityInGrams: 250,
        };

        const result = await updateIngredientLineUsecase.execute(request);

        expect(result.ingredient.id).toBe(alternativeIngredient.id);
        expect(result.ingredient.name).toBe('Turkey Breast');
        expect(result.quantityInGrams).toBe(250);
        expect(result.id).toBe(testIngredientLine.id);
      });
    });

    describe('Errors', () => {
      it('should throw NotFoundError when recipe does not exist', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'recipe' as const,
          parentEntityId: 'non-existent-recipe-id',
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 300,
        };

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(NotFoundError);
      });

      it('should throw NotFoundError when recipe does not exist', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'recipe' as const,
          parentEntityId: 'non-existent-recipe-id',
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 300,
        };

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(NotFoundError);

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(/UpdateIngredientLineUsecase:.*recipe.*not found/i);
      });

      it('should throw NotFoundError when ingredient line does not exist', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'recipe' as const,
          parentEntityId: testRecipe.id,
          ingredientLineId: 'non-existent-ingredient-line-id',
          quantityInGrams: 300,
        };

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(NotFoundError);

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(
          /UpdateIngredientLineUsecase:.*IngredientLine.*not.*belong.*recipe/i,
        );
      });

      it("should throw error when user tries to access another user's recipe", async () => {
        const request = {
          userId: anotherUserId,
          parentEntityType: 'recipe' as const,
          parentEntityId: testRecipe.id,
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 300,
        };

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(AuthError);

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(
          /UpdateIngredientLineUsecase:.*recipe.*not found for user/i,
        );
      });

      it("should throw error when user tries to access another user's meal", async () => {
        const request = {
          userId: anotherUserId,
          parentEntityType: 'meal' as const,
          parentEntityId: testMeal.id,
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 300,
        };

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(AuthError);

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(
          /UpdateIngredientLineUsecase:.*meal.*not found for user/i,
        );
      });
    });
  });

  describe('Meal line', () => {
    describe('Updated', () => {
      it('should update only the quantity when quantityInGrams is provided for meal', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'meal' as const,
          parentEntityId: testMeal.id,
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 350,
        };

        const result = await updateIngredientLineUsecase.execute(request);

        expect(result.quantityInGrams).toBe(350);
        expect(result.ingredient.id).toBe(
          testRecipe.ingredientLines[0].ingredient.id,
        );
        expect(result.id).toBe(testIngredientLine.id);
      });

      it('should return IngredientLineDTO', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'meal' as const,
          parentEntityId: testMeal.id,
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 350,
        };

        const result = await updateIngredientLineUsecase.execute(request);

        expect(result).not.toBeInstanceOf(IngredientLine);
        for (const prop of dto.ingredientLineDTOProperties) {
          expect(result).toHaveProperty(prop);
        }
      });

      it('should update only the ingredient when ingredientId is provided', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'meal' as const,
          parentEntityId: testMeal.id,
          ingredientLineId: testIngredientLine.id,
          ingredientId: alternativeIngredient.id,
        };

        const result = await updateIngredientLineUsecase.execute(request);

        expect(result.ingredient.id).toBe(alternativeIngredient.id);
        expect(result.ingredient.name).toBe(alternativeIngredient.name);
        expect(result.quantityInGrams).toBe(150);
        expect(result.id).toBe(testIngredientLine.id);
      });

      it('should update both ingredient and quantity when both are provided', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'meal' as const,
          parentEntityId: testMeal.id,
          ingredientLineId: testIngredientLine.id,
          ingredientId: alternativeIngredient.id,
          quantityInGrams: 250,
        };

        const result = await updateIngredientLineUsecase.execute(request);

        expect(result.ingredient.id).toBe(alternativeIngredient.id);
        expect(result.ingredient.name).toBe('Turkey Breast');
        expect(result.quantityInGrams).toBe(250);
        expect(result.id).toBe(testIngredientLine.id);
      });
    });

    describe('Errors', () => {
      it('should throw NotFoundError when meal does not exist', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'meal' as const,
          parentEntityId: 'non-existent-meal-id',
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 300,
        };

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(NotFoundError);

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(/UpdateIngredientLineUsecase:.*meal.*not found/i);
      });

      it('should throw NotFoundError when ingredient line does not exist', async () => {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: 'meal' as const,
          parentEntityId: testMeal.id,
          ingredientLineId: 'non-existent-ingredient-line-id',
          quantityInGrams: 300,
        };

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(NotFoundError);

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(
          /UpdateIngredientLineUsecase:.*IngredientLine.*not.*belong.*meal/i,
        );
      });

      it("should throw error when user tries to access another user's meal", async () => {
        const request = {
          userId: anotherUserId,
          parentEntityType: 'meal' as const,
          parentEntityId: testMeal.id,
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 300,
        };

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(AuthError);

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(
          /UpdateIngredientLineUsecase:.*meal.*not found for user/i,
        );
      });
    });
  });

  describe('Shared Errors', () => {
    let differentInfo: Array<{
      parentEntityType: 'recipe' | 'meal';
      parentEntityId: string;
    }>;

    beforeAll(() => {
      differentInfo = [
        {
          parentEntityType: 'recipe' as const,
          parentEntityId: testRecipe.id,
        },
        {
          parentEntityType: 'meal' as const,
          parentEntityId: testMeal.id,
        },
      ];
    });

    it('should throw NotFoundError when ingredient does not exist', async () => {
      for (const info of differentInfo) {
        const request = {
          userId: userTestProps.userId,
          parentEntityType: info.parentEntityType,
          parentEntityId: info.parentEntityId,
          ingredientLineId: testIngredientLine.id,
          ingredientId: 'non-existent-ingredient-id',
        };

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(NotFoundError);

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(
          /UpdateIngredientLineUsecase:.*Ingredient.*not found/i,
        );
      }
    });

    it('should throw error if user does not exist', async () => {
      for (const info of differentInfo) {
        const request = {
          userId: 'non-existent',
          parentEntityType: info.parentEntityType,
          parentEntityId: info.parentEntityId,
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 300,
        };

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(NotFoundError);

        await expect(
          updateIngredientLineUsecase.execute(request),
        ).rejects.toThrow(/UpdateIngredientLine.*User.*not.*found/);
      }
    });
  });
});
