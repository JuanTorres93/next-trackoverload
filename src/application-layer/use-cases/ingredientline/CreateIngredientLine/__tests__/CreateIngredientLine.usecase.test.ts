import * as vp from '@/../tests/createProps';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { MemoryIngredientLinesRepo } from '@/infra/memory/MemoryIngredientLinesRepo';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateIngredientLineUsecase } from '../CreateIngredientLine.usecase';

describe('CreateIngredientLineUsecase', () => {
  let ingredientLinesRepo: MemoryIngredientLinesRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let createIngredientLineUsecase: CreateIngredientLineUsecase;
  let testIngredient: Ingredient;

  beforeEach(() => {
    ingredientLinesRepo = new MemoryIngredientLinesRepo();
    ingredientsRepo = new MemoryIngredientsRepo();
    createIngredientLineUsecase = new CreateIngredientLineUsecase(
      ingredientLinesRepo,
      ingredientsRepo
    );

    testIngredient = Ingredient.create(vp.validIngredientProps);
  });

  it('should create a new ingredient line with valid data', async () => {
    await ingredientsRepo.saveIngredient(testIngredient);

    const result = await createIngredientLineUsecase.execute({
      ingredientId: testIngredient.id,
      quantityInGrams: 200,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.ingredient.id).toBe(testIngredient.id);
    expect(result.quantityInGrams).toBe(200);
    expect(result.calories).toBe(200); // 100 cal per 100g * 200g = 200 cal
    expect(result.protein).toBe(30); // 15g per 100g * 200g = 30g
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();

    // Verify it was saved to the repository
    const savedLine = await ingredientLinesRepo.getIngredientLineById(
      result.id
    );
    expect(savedLine).toBeDefined();
    expect(savedLine?.id).toBe(result.id);
  });

  it('should throw NotFoundError when ingredient does not exist', async () => {
    await expect(
      createIngredientLineUsecase.execute({
        ingredientId: 'non-existent-ingredient',
        quantityInGrams: 200,
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when quantityInGrams is zero', async () => {
    await ingredientsRepo.saveIngredient(testIngredient);

    await expect(
      createIngredientLineUsecase.execute({
        ingredientId: testIngredient.id,
        quantityInGrams: 0,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError when quantityInGrams is negative', async () => {
    await ingredientsRepo.saveIngredient(testIngredient);

    await expect(
      createIngredientLineUsecase.execute({
        ingredientId: testIngredient.id,
        quantityInGrams: -50,
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError when quantityInGrams is not a number', async () => {
    await ingredientsRepo.saveIngredient(testIngredient);

    const invalidQuantities = [null, undefined, 'string', {}, [], true, false];

    for (const invalidQuantity of invalidQuantities) {
      await expect(
        createIngredientLineUsecase.execute({
          ingredientId: testIngredient.id,
          // @ts-expect-error testing invalid types
          quantityInGrams: invalidQuantity,
        })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should handle different valid quantity values', async () => {
    await ingredientsRepo.saveIngredient(testIngredient);

    const testCases = [
      { quantity: 50, expectedCalories: 50, expectedProtein: 7.5 },
      { quantity: 100, expectedCalories: 100, expectedProtein: 15 },
      { quantity: 300, expectedCalories: 300, expectedProtein: 45 },
      { quantity: 0.5, expectedCalories: 0.5, expectedProtein: 0.075 },
    ];

    for (const { quantity, expectedCalories, expectedProtein } of testCases) {
      const result = await createIngredientLineUsecase.execute({
        ingredientId: testIngredient.id,
        quantityInGrams: quantity,
      });

      expect(result.quantityInGrams).toBe(quantity);
      expect(result.calories).toBeCloseTo(expectedCalories, 5);
      expect(result.protein).toBeCloseTo(expectedProtein, 5);
    }
  });

  it('should create multiple ingredient lines independently', async () => {
    await ingredientsRepo.saveIngredient(testIngredient);

    const result1 = await createIngredientLineUsecase.execute({
      ingredientId: testIngredient.id,
      quantityInGrams: 100,
    });

    const result2 = await createIngredientLineUsecase.execute({
      ingredientId: testIngredient.id,
      quantityInGrams: 200,
    });

    expect(result1.id).not.toBe(result2.id);
    expect(result1.quantityInGrams).toBe(100);
    expect(result2.quantityInGrams).toBe(200);

    // Verify both are saved
    const allLines = await ingredientLinesRepo.getAllIngredientLines();
    expect(allLines.length).toBe(2);
  });

  it('should create ingredient line with different ingredients', async () => {
    const ingredient1 = Ingredient.create({
      ...vp.validIngredientProps,
      name: 'Chicken',
    });

    const ingredient2 = Ingredient.create({
      ...vp.validIngredientProps,
      id: 'ing2',
      name: 'Rice',
      nutritionalInfoPer100g: {
        calories: 130,
        protein: 2.7,
      },
    });

    await ingredientsRepo.saveIngredient(ingredient1);
    await ingredientsRepo.saveIngredient(ingredient2);

    const result1 = await createIngredientLineUsecase.execute({
      ingredientId: ingredient1.id,
      quantityInGrams: 100,
    });

    const result2 = await createIngredientLineUsecase.execute({
      ingredientId: ingredient2.id,
      quantityInGrams: 100,
    });

    expect(result1.ingredient.id).toBe(ingredient1.id);
    expect(result2.ingredient.id).toBe(ingredient2.id);
    expect(result1.calories).toBe(100);
    expect(result2.calories).toBe(130);
  });

  it('should have correct timestamps', async () => {
    await ingredientsRepo.saveIngredient(testIngredient);

    const beforeCreation = new Date();

    const result = await createIngredientLineUsecase.execute({
      ingredientId: testIngredient.id,
      quantityInGrams: 200,
    });

    const afterCreation = new Date();

    const createdAt = new Date(result.createdAt);
    const updatedAt = new Date(result.updatedAt);

    expect(createdAt.getTime()).toBeGreaterThanOrEqual(
      beforeCreation.getTime()
    );
    expect(createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    expect(updatedAt.getTime()).toBeGreaterThanOrEqual(
      beforeCreation.getTime()
    );
    expect(updatedAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
  });
});
