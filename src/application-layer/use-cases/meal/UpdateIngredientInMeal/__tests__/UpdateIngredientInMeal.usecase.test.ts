import * as vp from '@/../tests/createProps';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateIngredientInMealUsecase } from '../UpdateIngredientInMeal.usecase';

describe('UpdateIngredientInMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let updateIngredientInMealUsecase: UpdateIngredientInMealUsecase;
  let testMeal: Meal;
  let testIngredient: Ingredient;
  let testIngredientLine: IngredientLine;
  let alternativeIngredient: Ingredient;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    ingredientsRepo = new MemoryIngredientsRepo();
    updateIngredientInMealUsecase = new UpdateIngredientInMealUsecase(
      mealsRepo,
      ingredientsRepo
    );

    testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    alternativeIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    testIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
    });

    testMeal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });
  });

  it('should update ingredient quantity in meal successfully', async () => {
    await mealsRepo.saveMeal(testMeal);

    const request = {
      userId: vp.userId,
      mealId: testMeal.id,
      ingredientLineId: testIngredientLine.id,
      quantityInGrams: 300,
    };

    const result = await updateIngredientInMealUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(1);
    const updatedLine = result.ingredientLines[0];
    expect(updatedLine.quantityInGrams).toBe(300);
    expect(updatedLine.ingredient.id).toBe(testIngredient.id);
  });

  it('should update ingredient in meal successfully', async () => {
    await mealsRepo.saveMeal(testMeal);
    await ingredientsRepo.saveIngredient(alternativeIngredient);

    const request = {
      userId: vp.userId,
      mealId: testMeal.id,
      ingredientLineId: testIngredientLine.id,
      ingredientId: alternativeIngredient.id,
    };

    const result = await updateIngredientInMealUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(1);
    const updatedLine = result.ingredientLines[0];
    expect(updatedLine.ingredient.id).toBe(alternativeIngredient.id);
    expect(updatedLine.quantityInGrams).toBe(
      testIngredientLine.quantityInGrams
    );
  });

  it('should update both ingredient and quantity in meal successfully', async () => {
    await mealsRepo.saveMeal(testMeal);
    await ingredientsRepo.saveIngredient(alternativeIngredient);

    const request = {
      userId: vp.userId,
      mealId: testMeal.id,
      ingredientLineId: testIngredientLine.id,
      ingredientId: alternativeIngredient.id,
      quantityInGrams: 250,
    };

    const result = await updateIngredientInMealUsecase.execute(request);

    expect(result.ingredientLines).toHaveLength(1);
    const updatedLine = result.ingredientLines[0];
    expect(updatedLine.ingredient.id).toBe(alternativeIngredient.id);
    expect(updatedLine.quantityInGrams).toBe(250);
  });

  it('should throw NotFoundError when meal does not exist', async () => {
    const request = {
      userId: vp.userId,
      mealId: 'non-existent-id',
      ingredientLineId: testIngredientLine.id,
      quantityInGrams: 300,
    };

    await expect(
      updateIngredientInMealUsecase.execute(request)
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when ingredient line does not exist in meal', async () => {
    await mealsRepo.saveMeal(testMeal);

    const request = {
      userId: vp.userId,
      mealId: testMeal.id,
      ingredientLineId: 'non-existent-line-id',
      quantityInGrams: 300,
    };

    await expect(
      updateIngredientInMealUsecase.execute(request)
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when new ingredient does not exist', async () => {
    await mealsRepo.saveMeal(testMeal);

    const request = {
      userId: vp.userId,
      mealId: testMeal.id,
      ingredientLineId: testIngredientLine.id,
      ingredientId: 'non-existent-ingredient-id',
    };

    await expect(
      updateIngredientInMealUsecase.execute(request)
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when no update fields are provided', async () => {
    const request = {
      userId: vp.userId,
      mealId: testMeal.id,
      ingredientLineId: testIngredientLine.id,
    };

    await expect(
      updateIngredientInMealUsecase.execute(request)
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError when mealId is invalid', async () => {
    const invalidIds = [null, undefined, 3, '', true, {}];

    for (const invalidId of invalidIds) {
      await expect(
        updateIngredientInMealUsecase.execute({
          // @ts-expect-error Testing invalid inputs
          mealId: invalidId,
          ingredientLineId: testIngredientLine.id,
          quantityInGrams: 300,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when ingredientLineId is invalid', async () => {
    const invalidIds = [null, undefined, 3, '', true, {}];

    for (const invalidId of invalidIds) {
      await expect(
        updateIngredientInMealUsecase.execute({
          mealId: testMeal.id,
          // @ts-expect-error Testing invalid inputs
          ingredientLineId: invalidId,
          quantityInGrams: 300,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw ValidationError when quantityInGrams is invalid', async () => {
    await mealsRepo.saveMeal(testMeal);

    const invalidQuantities = [0, -1, -100, null, 'string', {}, []];

    for (const invalidQuantity of invalidQuantities) {
      await expect(
        updateIngredientInMealUsecase.execute({
          mealId: testMeal.id,
          ingredientLineId: testIngredientLine.id,
          // @ts-expect-error Testing invalid inputs
          quantityInGrams: invalidQuantity,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error if userId is invalid', async () => {
    const invalidIds = [null, undefined, 3, '', true, {}];

    for (const invalidId of invalidIds) {
      await expect(
        updateIngredientInMealUsecase.execute({
          // @ts-expect-error Testing invalid inputs
          userId: invalidId,
          mealId: testMeal.id,
          ingredientLineId: testIngredientLine.id,
          ingredientId: testIngredient.id,
        })
      ).rejects.toThrow(ValidationError);
    }
  });
});
