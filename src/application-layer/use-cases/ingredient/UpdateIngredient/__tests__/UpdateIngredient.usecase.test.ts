import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateIngredientUsecase } from '../UpdateIngredient.usecase';

describe('UpdateIngredientUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let updateIngredientUsecase: UpdateIngredientUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    updateIngredientUsecase = new UpdateIngredientUsecase(ingredientsRepo);
  });

  it('should update ingredient name', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    await ingredientsRepo.saveIngredient(ingredient);

    const updatedIngredient = await updateIngredientUsecase.execute({
      id: ingredient.id,
      name: 'UPDATED INGREDIENT',
    });

    expect(updatedIngredient.name).toBe('UPDATED INGREDIENT');
    expect(updatedIngredient.id).toBe(ingredient.id);
    expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(
      ingredient.nutritionalInfoPer100g.calories
    );
    expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(
      ingredient.nutritionalInfoPer100g.protein
    );
    expect(updatedIngredient.createdAt).toBe(
      ingredient.createdAt.toISOString()
    );
    expect(updatedIngredient.updatedAt).not.toBe(
      ingredient.updatedAt.toISOString()
    );
  });

  it('should update ingredient calories', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    await ingredientsRepo.saveIngredient(ingredient);

    const updatedIngredient = await updateIngredientUsecase.execute({
      id: ingredient.id,
      calories: 3333,
    });

    expect(updatedIngredient.name).toBe(vp.validIngredientProps.name);
    expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(3333);
    expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(
      vp.validIngredientProps.nutritionalInfoPer100g.protein
    );
    expect(updatedIngredient.updatedAt).not.toBe(
      ingredient.updatedAt.toISOString()
    );
  });

  it('should update ingredient protein', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    await ingredientsRepo.saveIngredient(ingredient);

    const updatedIngredient = await updateIngredientUsecase.execute({
      id: ingredient.id,
      protein: 666,
    });

    expect(updatedIngredient.name).toBe(vp.validIngredientProps.name);
    expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(
      vp.validIngredientProps.nutritionalInfoPer100g.calories
    );
    expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(666);
    expect(updatedIngredient.updatedAt).not.toBe(
      ingredient.updatedAt.toISOString()
    );
  });

  it('should update multiple properties at once', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    await ingredientsRepo.saveIngredient(ingredient);

    const updatedIngredient = await updateIngredientUsecase.execute({
      id: ingredient.id,
      name: 'UPDATED NAME',
      calories: 222,
      protein: 888,
    });

    expect(updatedIngredient.name).toBe('UPDATED NAME');
    expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(222);
    expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(888);
    expect(updatedIngredient.updatedAt).not.toBe(
      ingredient.updatedAt.toISOString()
    );
  });

  it('should throw NotFoundError when ingredient does not exist', async () => {
    await expect(
      updateIngredientUsecase.execute({
        id: 'non-existent',
        name: 'New Name',
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should not update ingredient if no changes provided', async () => {
    const ingredient = Ingredient.create({
      id: '1',
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await ingredientsRepo.saveIngredient(ingredient);

    const updatedIngredient = await updateIngredientUsecase.execute({
      id: '1',
    });

    expect(updatedIngredient.name).toBe(ingredient.name);
    expect(updatedIngredient.nutritionalInfoPer100g).toEqual(
      ingredient.nutritionalInfoPer100g
    );
    expect(updatedIngredient.updatedAt).toBe(
      ingredient.updatedAt.toISOString()
    );
  });

  it('should throw error when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        updateIngredientUsecase.execute({ id: invalidId, name: 'New Name' })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when name is invalid', async () => {
    const ingredient = Ingredient.create({
      id: '1',
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await ingredientsRepo.saveIngredient(ingredient);

    const invalidNames = [true, 4, null];

    for (const invalidName of invalidNames) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        updateIngredientUsecase.execute({ id: '1', name: invalidName })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when calories is  negative', async () => {
    const ingredient = Ingredient.create({
      id: '1',
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await ingredientsRepo.saveIngredient(ingredient);

    await expect(
      updateIngredientUsecase.execute({ id: '1', calories: -10 })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error when protein is negative', async () => {
    const ingredient = Ingredient.create({
      id: '1',
      name: 'Chicken Breast',
      nutritionalInfoPer100g: {
        calories: 165,
        protein: 31,
      },
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await ingredientsRepo.saveIngredient(ingredient);

    await expect(
      updateIngredientUsecase.execute({ id: '1', protein: -5 })
    ).rejects.toThrow(ValidationError);
  });

  it('should return IngredientDTO', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: '1',
    });

    await ingredientsRepo.saveIngredient(ingredient);

    const updatedIngredient = await updateIngredientUsecase.execute({
      id: '1',
      name: 'Updated Name',
    });

    expect(updatedIngredient).not.toBeInstanceOf(Ingredient);

    for (const prop of dto.ingredientDTOProperties) {
      expect(updatedIngredient).toHaveProperty(prop);
    }
  });
});
