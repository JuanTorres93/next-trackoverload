import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllIngredientsUsecase } from '../GetAllIngredients.usecase';

describe('GetAllIngredientsUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let getAllIngredientsUsecase: GetAllIngredientsUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    getAllIngredientsUsecase = new GetAllIngredientsUsecase(ingredientsRepo);
  });

  describe('Found', () => {
    it('should return all ingredients', async () => {
      const ingredient1 = Ingredient.create({
        ...vp.validIngredientProps,
        name: 'Chicken Breast',
      });
      const ingredient2 = Ingredient.create({
        ...vp.validIngredientProps,
        id: 'ing-2',
        name: 'Rice',
      });

      await ingredientsRepo.saveIngredient(ingredient1);
      await ingredientsRepo.saveIngredient(ingredient2);

      const ingredients = await getAllIngredientsUsecase.execute();

      const ingredientIds = ingredients.map((i) => i.id);

      expect(ingredients).toHaveLength(2);
      expect(ingredientIds).toContain(ingredient1.id);
      expect(ingredientIds).toContain(ingredient2.id);
    });

    it('should return an array of IngredientDTO', async () => {
      const ingredient1 = Ingredient.create({
        ...vp.validIngredientProps,
        name: 'Chicken Breast',
      });
      const ingredient2 = Ingredient.create({
        ...vp.validIngredientProps,
        id: 'ing-2',
        name: 'Rice',
      });

      await ingredientsRepo.saveIngredient(ingredient1);
      await ingredientsRepo.saveIngredient(ingredient2);

      const ingredients = await getAllIngredientsUsecase.execute();

      expect(ingredients).toHaveLength(2);

      for (const ingredient of ingredients) {
        expect(ingredient).not.toBeInstanceOf(Ingredient);

        for (const prop of dto.ingredientDTOProperties) {
          expect(ingredient).toHaveProperty(prop);
        }
      }
    });

    it('should return empty array when no ingredients exist', async () => {
      const ingredients = await getAllIngredientsUsecase.execute();

      expect(ingredients).toHaveLength(0);
    });
  });
});
