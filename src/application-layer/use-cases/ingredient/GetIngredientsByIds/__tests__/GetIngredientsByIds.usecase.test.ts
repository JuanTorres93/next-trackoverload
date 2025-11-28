import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetIngredientsByIdsUsecase } from '../GetIngredientsByIds.usecase';

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
      ...vp.validIngredientProps,
      name: 'Chicken Breast',
    });
    const ingredient2 = Ingredient.create({
      ...vp.validIngredientProps,
      id: '2',
      name: 'Rice',
    });

    await ingredientsRepo.saveIngredient(ingredient1);
    await ingredientsRepo.saveIngredient(ingredient2);

    const ingredients = await getIngredientsByIdsUsecase.execute({
      // NOTE: in the future this will fail, because I'll add UUID validation
      ids: [vp.validIngredientProps.id, '2', 'non-existent'],
    });

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
      id: '2',
      name: 'Rice',
    });

    await ingredientsRepo.saveIngredient(ingredient1);
    await ingredientsRepo.saveIngredient(ingredient2);

    const ingredients = await getIngredientsByIdsUsecase.execute({
      ids: [vp.validIngredientProps.id, '2'],
    });

    expect(ingredients).toHaveLength(2);

    for (const ingredient of ingredients) {
      expect(ingredient).not.toBeInstanceOf(Ingredient);

      for (const prop of dto.ingredientDTOProperties) {
        expect(ingredient).toHaveProperty(prop);
      }
    }
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
