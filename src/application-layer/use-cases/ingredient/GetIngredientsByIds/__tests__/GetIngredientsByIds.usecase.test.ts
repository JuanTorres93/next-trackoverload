import { beforeEach, describe, expect, it } from 'vitest';
import { GetIngredientsByIdsUsecase } from '../GetIngredientsByIds.usecase';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError } from '@/domain/common/errors';

describe('GetIngredientsByIdsUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let getIngredientsByIdsUsecase: GetIngredientsByIdsUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    getIngredientsByIdsUsecase = new GetIngredientsByIdsUsecase(
      ingredientsRepo
    );
  });

  it('should return ingredients that exist', async () => {
    const ingredient1 = Ingredient.create({
      id: '1',
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const ingredient2 = Ingredient.create({
      id: '2',
      name: 'Rice',
      nutritionalInfoPer100g: {
        calories: 130,
        protein: 2.7,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ingredientsRepo.saveIngredient(ingredient1);
    await ingredientsRepo.saveIngredient(ingredient2);

    const ingredients = await getIngredientsByIdsUsecase.execute({
      // NOTE: in the future this will fail, because I'll add UUID validation
      ids: ['1', '2', 'non-existent'],
    });

    expect(ingredients).toHaveLength(2);
    expect(ingredients).toContain(ingredient1);
    expect(ingredients).toContain(ingredient2);
  });

  it('should return empty array when no ingredients found', async () => {
    const ingredients = await getIngredientsByIdsUsecase.execute({
      ids: ['non-existent-1', 'non-existent-2'],
    });

    expect(ingredients).toHaveLength(0);
  });

  it('should return empty array when ids array is empty', async () => {
    const ingredients = await getIngredientsByIdsUsecase.execute({
      ids: [],
    });

    expect(ingredients).toHaveLength(0);
  });

  it('should throw error when ids are invalid', async () => {
    const invalidIds = [true, 4, null, undefined];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        getIngredientsByIdsUsecase.execute({ ids: [invalidId] })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when ids contain empty strings', async () => {
    await expect(
      getIngredientsByIdsUsecase.execute({ ids: ['1', '', '2'] })
    ).rejects.toThrow(ValidationError);
  });
});
