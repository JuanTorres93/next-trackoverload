import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateIngredientInMealUsecase } from '../UpdateIngredientInMeal.usecase';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

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
      id: uuidv4(),
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    alternativeIngredient = Ingredient.create({
      id: uuidv4(),
      name: 'Turkey Breast',
      nutritionalInfoPer100g: {
        calories: 135,
        protein: 30,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testIngredientLine = IngredientLine.create({
      id: uuidv4(),
      ingredient: testIngredient,
      quantityInGrams: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testMeal = Meal.create({
      id: uuidv4(),
      name: 'Protein Meal',
      ingredientLines: [testIngredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should update ingredient quantity in meal successfully', async () => {
    await mealsRepo.saveMeal(testMeal);

    const request = {
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
});
