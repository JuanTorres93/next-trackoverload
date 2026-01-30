import * as vp from '@/../tests/createProps';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as dto from '@/../tests/dtoProperties';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { MemoryIngredientsRepo } from '@/infra/repos/memory/MemoryIngredientsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetIngredientByIdUsecase } from '../GetIngredientById.usecase';

describe('GetIngredientByIdUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let getIngredientByIdUsecase: GetIngredientByIdUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    getIngredientByIdUsecase = new GetIngredientByIdUsecase(ingredientsRepo);
  });

  describe('Found', () => {
    it('should return ingredient when found', async () => {
      const ingredient = Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        name: 'Chicken Breast',
      });

      await ingredientsRepo.saveIngredient(ingredient);

      const result = await getIngredientByIdUsecase.execute({
        id: ingredientTestProps.validIngredientProps.id,
      });

      expect(result).not.toBeNull();
      expect(result?.id).toBe(ingredient.id);
      expect(result?.name).toBe(ingredient.name);
    });

    it('should return IngredientDTO when ingredient found', async () => {
      const ingredient = Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        name: 'Chicken Breast',
      });

      await ingredientsRepo.saveIngredient(ingredient);

      const result = await getIngredientByIdUsecase.execute({
        id: ingredientTestProps.validIngredientProps.id,
      });

      expect(result).not.toBeNull();
      expect(result).not.toBeInstanceOf(Ingredient);

      for (const prop of dto.ingredientDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should return null when ingredient not found', async () => {
      const result = await getIngredientByIdUsecase.execute({
        id: 'non-existent',
      });

      expect(result).toBeNull();
    });
  });
});
