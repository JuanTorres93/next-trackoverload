import { beforeEach, describe, expect, it } from 'vitest';
import { GetIngredientByIdUsecase } from '../GetIngredientById.usecase';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Id } from '@/domain/value-objects/Id/Id';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('GetIngredientByIdUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let getIngredientByIdUsecase: GetIngredientByIdUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    getIngredientByIdUsecase = new GetIngredientByIdUsecase(ingredientsRepo);
  });

  it('should return ingredient when found', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: Id.create('1'),
      name: 'Chicken Breast',
    });

    await ingredientsRepo.saveIngredient(ingredient);

    const result = await getIngredientByIdUsecase.execute({ id: '1' });

    expect(result).not.toBeNull();
    expect(result?.id).toBe(ingredient.id);
    expect(result?.name).toBe(ingredient.name);
  });

  it('should return IngredientDTO when ingredient found', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: Id.create('1'),
      name: 'Chicken Breast',
    });

    await ingredientsRepo.saveIngredient(ingredient);

    const result = await getIngredientByIdUsecase.execute({ id: '1' });

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
