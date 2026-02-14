import { NotFoundError } from '@/domain/common/errors';
import { MemoryIngredientsRepo } from '@/infra/repos/memory/MemoryIngredientsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import { DeleteIngredientUsecase } from '../DeleteIngredient.usecase';

describe('DeleteIngredientUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let deleteIngredientUsecase: DeleteIngredientUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    deleteIngredientUsecase = new DeleteIngredientUsecase(ingredientsRepo);
  });

  describe('Deletion', () => {
    it('should delete existing ingredient', async () => {
      const ingredient = ingredientTestProps.createTestIngredient();

      await ingredientsRepo.saveIngredient(ingredient);

      await deleteIngredientUsecase.execute({
        id: ingredient.id,
      });

      const deletedIngredient = await ingredientsRepo.getIngredientById(
        ingredient.id,
      );
      expect(deletedIngredient).toBeNull();
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when ingredient does not exist', async () => {
      await expect(
        deleteIngredientUsecase.execute({ id: 'non-existent' }),
      ).rejects.toThrow(NotFoundError);
      await expect(
        deleteIngredientUsecase.execute({ id: 'non-existent' }),
      ).rejects.toThrow(/DeleteIngredientUsecase.*Ingredient.*not found/);
    });
  });
});
