import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateIngredientUsecase } from '../UpdateIngredient.usecase';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Id } from '@/domain/types/Id/Id';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('UpdateIngredientUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let updateIngredientUsecase: UpdateIngredientUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    updateIngredientUsecase = new UpdateIngredientUsecase(ingredientsRepo);
  });

  it('should update ingredient name', async () => {
    const ingredient = Ingredient.create({
      id: Id.create('1'),
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
      name: 'Grilled Chicken Breast',
    });

    expect(updatedIngredient.name).toBe('Grilled Chicken Breast');
    expect(updatedIngredient.id).toBe('1');
    expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(165);
    expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(31);
    expect(updatedIngredient.createdAt).toBe(
      ingredient.createdAt.toISOString()
    );
    expect(updatedIngredient.updatedAt).not.toBe(
      ingredient.updatedAt.toISOString()
    );
  });

  it('should update ingredient calories', async () => {
    const ingredient = Ingredient.create({
      id: Id.create('1'),
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
      calories: 170,
    });

    expect(updatedIngredient.name).toBe('Chicken Breast');
    expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(170);
    expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(31);
    expect(updatedIngredient.updatedAt).not.toBe(
      ingredient.updatedAt.toISOString()
    );
  });

  it('should update ingredient protein', async () => {
    const ingredient = Ingredient.create({
      id: Id.create('1'),
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
      protein: 32,
    });

    expect(updatedIngredient.name).toBe('Chicken Breast');
    expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(165);
    expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(32);
    expect(updatedIngredient.updatedAt).not.toBe(
      ingredient.updatedAt.toISOString()
    );
  });

  it('should update multiple properties at once', async () => {
    const ingredient = Ingredient.create({
      id: Id.create('1'),
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
      name: 'Grilled Chicken Breast',
      calories: 170,
      protein: 32,
    });

    expect(updatedIngredient.name).toBe('Grilled Chicken Breast');
    expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(170);
    expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(32);
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
      id: Id.create('1'),
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
      id: Id.create('1'),
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
      id: Id.create('1'),
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
      id: Id.create('1'),
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
      id: Id.create('1'),
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
