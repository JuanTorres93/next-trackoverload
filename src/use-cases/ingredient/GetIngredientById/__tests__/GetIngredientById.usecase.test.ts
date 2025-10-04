import { beforeEach, describe, expect, it } from 'vitest';
import { GetIngredientByIdUsecase } from '../GetIngredientById.usecase';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError } from '@/domain/common/errors';

describe('GetIngredientByIdUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let getIngredientByIdUsecase: GetIngredientByIdUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    getIngredientByIdUsecase = new GetIngredientByIdUsecase(ingredientsRepo);
  });

  it('should return ingredient when found', async () => {
    const ingredient = Ingredient.create({
      id: '1',
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ingredientsRepo.saveIngredient(ingredient);

    const result = await getIngredientByIdUsecase.execute({ id: '1' });

    expect(result).toEqual(ingredient);
  });

  it('should return null when ingredient not found', async () => {
    const result = await getIngredientByIdUsecase.execute({
      id: 'non-existent',
    });

    expect(result).toBeNull();
  });

  it('should throw error when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        getIngredientByIdUsecase.execute({ id: invalidId })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when id is empty string', async () => {
    await expect(getIngredientByIdUsecase.execute({ id: '' })).rejects.toThrow(
      ValidationError
    );
  });
});
