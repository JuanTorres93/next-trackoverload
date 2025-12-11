import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { CreateIngredientUsecase } from '../CreateIngredient.usecase';

describe('CreateIngredientUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let createIngredientUsecase: CreateIngredientUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    createIngredientUsecase = new CreateIngredientUsecase(ingredientsRepo);
  });

  describe('Creation', () => {
    it('should create and save a new ingredient', async () => {
      const request = {
        name: vp.validIngredientProps.name,
        calories: vp.validIngredientProps.calories,
        protein: vp.validIngredientProps.protein,
      };

      const ingredient = await createIngredientUsecase.execute(request);

      expect(ingredient).toHaveProperty('id');
      expect(ingredient.name).toBe(request.name);
      expect(ingredient.nutritionalInfoPer100g.calories).toBe(request.calories);
      expect(ingredient.nutritionalInfoPer100g.protein).toBe(request.protein);
      expect(ingredient).toHaveProperty('createdAt');
      expect(ingredient).toHaveProperty('updatedAt');

      const savedIngredient = await ingredientsRepo.getIngredientById(
        ingredient.id
      );
      expect(savedIngredient).toBeDefined();
    });

    it('should return IngredientDTO', async () => {
      const request = {
        name: vp.validIngredientProps.name,
        calories: vp.validIngredientProps.calories,
        protein: vp.validIngredientProps.protein,
      };

      const ingredient = await createIngredientUsecase.execute(request);

      expect(ingredient).not.toBeInstanceOf(Ingredient);

      for (const prop of dto.ingredientDTOProperties) {
        expect(ingredient).toHaveProperty(prop);
      }
    });
  });
});
