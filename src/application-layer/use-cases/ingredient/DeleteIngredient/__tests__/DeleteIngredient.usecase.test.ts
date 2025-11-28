import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteIngredientUsecase } from '../DeleteIngredient.usecase';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';

describe('DeleteIngredientUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let deleteIngredientUsecase: DeleteIngredientUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    deleteIngredientUsecase = new DeleteIngredientUsecase(ingredientsRepo);
  });

  it('should delete existing ingredient', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    await ingredientsRepo.saveIngredient(ingredient);

    await deleteIngredientUsecase.execute({
      id: vp.validIngredientProps.id,
    });

    const deletedIngredient = await ingredientsRepo.getIngredientById(
      vp.validIngredientProps.id
    );
    expect(deletedIngredient).toBeNull();
  });

  it('should throw NotFoundError when ingredient does not exist', async () => {
    await expect(
      deleteIngredientUsecase.execute({ id: 'non-existent' })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        deleteIngredientUsecase.execute({ id: invalidId })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when id is empty string', async () => {
    await expect(deleteIngredientUsecase.execute({ id: '' })).rejects.toThrow(
      ValidationError
    );
  });
});
