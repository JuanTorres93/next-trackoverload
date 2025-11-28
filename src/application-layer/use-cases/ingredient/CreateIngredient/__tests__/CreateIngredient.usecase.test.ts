import { beforeEach, describe, expect, it } from 'vitest';
import { CreateIngredientUsecase } from '../CreateIngredient.usecase';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('CreateIngredientUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let createIngredientUsecase: CreateIngredientUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    createIngredientUsecase = new CreateIngredientUsecase(ingredientsRepo);
  });

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

  it('should throw an error if name is empty', async () => {
    const request = {
      name: '',
      calories: 165,
      protein: 31,
    };

    await expect(createIngredientUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw an error if calories is negative', async () => {
    const requestNegative = {
      name: 'Chicken Breast',
      calories: -10,
      protein: 31,
    };

    await expect(
      createIngredientUsecase.execute(requestNegative)
    ).rejects.toThrow(ValidationError);

    await expect(
      createIngredientUsecase.execute(requestNegative)
    ).rejects.toThrow(/Float.*positive/);
  });

  it('should throw an error if protein is negative', async () => {
    const requestNegative = {
      name: 'Chicken Breast',
      calories: 165,
      protein: -5,
    };

    await expect(
      createIngredientUsecase.execute(requestNegative)
    ).rejects.toThrow(ValidationError);

    await expect(
      createIngredientUsecase.execute(requestNegative)
    ).rejects.toThrow(/Float.*positive/);
  });

  it('should throw an error if name is not a string', async () => {
    const request = {
      name: 123,
      calories: 165,
      protein: 31,
    };

    // @ts-expect-error testing invalid input
    await expect(createIngredientUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw an error if calories is not a number', async () => {
    const request = {
      name: 'Chicken Breast',
      calories: 'invalid',
      protein: 31,
    };

    // @ts-expect-error testing invalid input
    await expect(createIngredientUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw an error if protein is not a number', async () => {
    const request = {
      name: 'Chicken Breast',
      calories: 165,
      protein: 'invalid',
    };

    // @ts-expect-error testing invalid input
    await expect(createIngredientUsecase.execute(request)).rejects.toThrow(
      ValidationError
    );
  });
});
