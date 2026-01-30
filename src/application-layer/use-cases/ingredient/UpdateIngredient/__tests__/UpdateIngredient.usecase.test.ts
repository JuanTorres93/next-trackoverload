import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { MemoryIngredientsRepo } from '@/infra/repos/memory/MemoryIngredientsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateIngredientUsecase } from '../UpdateIngredient.usecase';

describe('UpdateIngredientUsecase', () => {
  let ingredient: Ingredient;
  let ingredientsRepo: MemoryIngredientsRepo;
  let updateIngredientUsecase: UpdateIngredientUsecase;

  beforeEach(async () => {
    ingredientsRepo = new MemoryIngredientsRepo();
    updateIngredientUsecase = new UpdateIngredientUsecase(ingredientsRepo);

    ingredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
    });

    await ingredientsRepo.saveIngredient(ingredient);
    // Wait a bit to ensure updatedAt will be different
    await new Promise((resolve) => setTimeout(resolve, 5));
  });

  describe('Updated', () => {
    it('should save updated ingredient to repo', async () => {
      await updateIngredientUsecase.execute({
        id: ingredient.id,
        patch: {
          name: 'NEW NAME',
        },
      });

      const savedIngredient = await ingredientsRepo.getIngredientById(
        ingredient.id,
      );

      expect(savedIngredient).not.toBeNull();
      expect(savedIngredient!.name).toBe('NEW NAME');
    });

    it('should update ingredient name', async () => {
      const updatedIngredient = await updateIngredientUsecase.execute({
        id: ingredient.id,
        patch: {
          name: 'UPDATED INGREDIENT',
        },
      });

      expect(updatedIngredient.name).toBe('UPDATED INGREDIENT');
      expect(updatedIngredient.id).toBe(ingredient.id);
      expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(
        ingredient.nutritionalInfoPer100g.calories,
      );
      expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(
        ingredient.nutritionalInfoPer100g.protein,
      );
      expect(updatedIngredient.createdAt).toBe(
        ingredient.createdAt.toISOString(),
      );
      expect(updatedIngredient.updatedAt).not.toBe(
        ingredientTestProps.validIngredientProps.updatedAt.toISOString(),
      );
    });

    it('should update ingredient calories', async () => {
      const updatedIngredient = await updateIngredientUsecase.execute({
        id: ingredient.id,
        patch: {
          calories: 3333,
        },
      });

      expect(updatedIngredient.name).toBe(
        ingredientTestProps.validIngredientProps.name,
      );
      expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(3333);
      expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(
        ingredientTestProps.validIngredientProps.protein,
      );
      expect(updatedIngredient.updatedAt).not.toBe(
        ingredientTestProps.validIngredientProps.updatedAt.toISOString(),
      );
    });

    it('should update ingredient protein', async () => {
      const updatedIngredient = await updateIngredientUsecase.execute({
        id: ingredient.id,
        patch: {
          protein: 666,
        },
      });

      expect(updatedIngredient.name).toBe(
        ingredientTestProps.validIngredientProps.name,
      );
      expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(
        ingredientTestProps.validIngredientProps.calories,
      );
      expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(666);
      expect(updatedIngredient.updatedAt).not.toBe(
        ingredientTestProps.validIngredientProps.updatedAt.toISOString(),
      );
    });

    it('should update multiple properties at once', async () => {
      const updatedIngredient = await updateIngredientUsecase.execute({
        id: ingredient.id,
        patch: {
          name: 'UPDATED NAME',
          calories: 222,
          protein: 888,
        },
      });

      expect(updatedIngredient.name).toBe('UPDATED NAME');
      expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(222);
      expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(888);
      expect(updatedIngredient.updatedAt).not.toBe(
        ingredientTestProps.validIngredientProps.updatedAt.toISOString(),
      );
    });

    it('should return IngredientDTO', async () => {
      const updatedIngredient = await updateIngredientUsecase.execute({
        id: ingredient.id,
        patch: {
          name: 'Updated Name',
        },
      });

      expect(updatedIngredient).not.toBeInstanceOf(Ingredient);

      for (const prop of dto.ingredientDTOProperties) {
        expect(updatedIngredient).toHaveProperty(prop);
      }
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when ingredient does not exist', async () => {
      await expect(
        updateIngredientUsecase.execute({
          id: 'non-existent',
          patch: {
            name: 'New Name',
          },
        }),
      ).rejects.toThrow(NotFoundError);

      await expect(
        updateIngredientUsecase.execute({
          id: 'non-existent',
          patch: {
            name: 'New Name',
          },
        }),
      ).rejects.toThrow(/UpdateIngredientUsecase.*Ingredient.*not found/);
    });
  });
});
