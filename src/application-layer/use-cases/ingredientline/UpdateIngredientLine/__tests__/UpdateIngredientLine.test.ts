import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateIngredientLineUsecase } from '../UpdateIngredientLine.usecase';
import { MemoryIngredientLinesRepo } from '@/infra/memory/MemoryIngredientLinesRepo';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError, NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

describe('UpdateIngredientLineUsecase', () => {
  let ingredientLinesRepo: MemoryIngredientLinesRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let updateIngredientLineUsecase: UpdateIngredientLineUsecase;
  let testIngredientLine: IngredientLine;
  let testIngredient: Ingredient;
  let alternativeIngredient: Ingredient;

  beforeEach(() => {
    ingredientLinesRepo = new MemoryIngredientLinesRepo();
    ingredientsRepo = new MemoryIngredientsRepo();
    updateIngredientLineUsecase = new UpdateIngredientLineUsecase(
      ingredientLinesRepo,
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
  });

  describe('Successful updates', () => {
    it('should update only the quantity when quantityInGrams is provided', async () => {
      await ingredientLinesRepo.saveIngredientLine(testIngredientLine);

      const request = {
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 300,
      };

      const result = await updateIngredientLineUsecase.execute(request);

      expect(result.quantityInGrams).toBe(300);
      expect(result.ingredient.id).toBe(testIngredient.id);
      expect(result.ingredient.name).toBe('Chicken Breast');
      expect(result.id).toBe(testIngredientLine.id);
    });

    it('should update only the ingredient when ingredientId is provided', async () => {
      await ingredientLinesRepo.saveIngredientLine(testIngredientLine);
      await ingredientsRepo.saveIngredient(alternativeIngredient);

      const request = {
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
      await ingredientLinesRepo.saveIngredientLine(testIngredientLine);
      await ingredientsRepo.saveIngredient(alternativeIngredient);

      const request = {
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

    it('should recalculate calories and protein correctly after update', async () => {
      await ingredientLinesRepo.saveIngredientLine(testIngredientLine);
      await ingredientsRepo.saveIngredient(alternativeIngredient);

      const request = {
        ingredientLineId: testIngredientLine.id,
        ingredientId: alternativeIngredient.id,
        quantityInGrams: 100,
      };

      const result = await updateIngredientLineUsecase.execute(request);

      // Turkey Breast: 135 calories, 30 protein per 100g
      expect(result.calories).toBe(135);
      expect(result.protein).toBe(30);
    });

    it('should update the updatedAt timestamp', async () => {
      await ingredientLinesRepo.saveIngredientLine(testIngredientLine);
      const originalUpdatedAt = testIngredientLine.updatedAt;

      // Wait a bit to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 2));

      const request = {
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 300,
      };

      const result = await updateIngredientLineUsecase.execute(request);

      expect(result.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });
  });

  describe('Validation errors', () => {
    it('should throw ValidationError for empty ingredientLineId', async () => {
      const request = {
        ingredientLineId: '',
        quantityInGrams: 300,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError when neither ingredientId nor quantityInGrams is provided', async () => {
      const request = {
        ingredientLineId: testIngredientLine.id,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid quantityInGrams (zero)', async () => {
      const request = {
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 0,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid quantityInGrams (negative)', async () => {
      const request = {
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: -100,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid quantityInGrams (non-number)', async () => {
      const request = {
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 'invalid' as unknown as number,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for empty ingredientId', async () => {
      await ingredientLinesRepo.saveIngredientLine(testIngredientLine);

      const request = {
        ingredientLineId: testIngredientLine.id,
        ingredientId: '',
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('Not found errors', () => {
    it('should throw NotFoundError when ingredient line does not exist', async () => {
      const request = {
        ingredientLineId: 'non-existent-id',
        quantityInGrams: 300,
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);
      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when ingredient does not exist', async () => {
      await ingredientLinesRepo.saveIngredientLine(testIngredientLine);

      const request = {
        ingredientLineId: testIngredientLine.id,
        ingredientId: 'non-existent-ingredient-id',
      };

      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);
      await expect(
        updateIngredientLineUsecase.execute(request)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('Repository interactions', () => {
    it('should save the updated ingredient line to the repository', async () => {
      await ingredientLinesRepo.saveIngredientLine(testIngredientLine);

      const request = {
        ingredientLineId: testIngredientLine.id,
        quantityInGrams: 300,
      };

      const result = await updateIngredientLineUsecase.execute(request);

      // Verify that the updated ingredient line is saved by retrieving it
      const savedIngredientLine =
        await ingredientLinesRepo.getIngredientLineById(testIngredientLine.id);
      expect(savedIngredientLine).not.toBeNull();
      expect(savedIngredientLine!.quantityInGrams).toBe(300);
      expect(savedIngredientLine!.id).toBe(result.id);
    });
  });
});
