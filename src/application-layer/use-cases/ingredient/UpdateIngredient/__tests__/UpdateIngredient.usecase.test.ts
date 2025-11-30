import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { UpdateIngredientUsecase } from '../UpdateIngredient.usecase';

describe('UpdateIngredientUsecase', () => {
  let ingredient: Ingredient;
  let ingredientsRepo: MemoryIngredientsRepo;
  let updateIngredientUsecase: UpdateIngredientUsecase;

  beforeEach(async () => {
    ingredientsRepo = new MemoryIngredientsRepo();
    updateIngredientUsecase = new UpdateIngredientUsecase(ingredientsRepo);

    ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    await ingredientsRepo.saveIngredient(ingredient);
    // Wait a bit to ensure updatedAt will be different
    await new Promise((resolve) => setTimeout(resolve, 5));
  });

  it('should update ingredient name', async () => {
    const updatedIngredient = await updateIngredientUsecase.execute({
      id: ingredient.id,
      patch: {
        name: 'UPDATED INGREDIENT',
      },
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
      vp.validIngredientProps.updatedAt.toISOString()
    );
  });

  it('should update ingredient calories', async () => {
    const updatedIngredient = await updateIngredientUsecase.execute({
      id: ingredient.id,
      patch: {
        calories: 3333,
      },
    });

    expect(updatedIngredient.name).toBe(vp.validIngredientProps.name);
    expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(3333);
    expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(
      vp.validIngredientProps.protein
    );
    expect(updatedIngredient.updatedAt).not.toBe(
      vp.validIngredientProps.updatedAt.toISOString()
    );
  });

  it('should update ingredient protein', async () => {
    const updatedIngredient = await updateIngredientUsecase.execute({
      id: ingredient.id,
      patch: {
        protein: 666,
      },
    });

    expect(updatedIngredient.name).toBe(vp.validIngredientProps.name);
    expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(
      vp.validIngredientProps.calories
    );
    expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(666);
    expect(updatedIngredient.updatedAt).not.toBe(
      vp.validIngredientProps.updatedAt.toISOString()
    );
  });

  it('should update multiple properties at once', async () => {
    const updatedIngredient = await updateIngredientUsecase.execute({
      id: ingredient.id,
      patch: {
        name: 'UPDATED NAME',
        calories: 222,
        protein: 888,
      },
    });

    expect(updatedIngredient.name).toBe('UPDATED NAME');
    expect(updatedIngredient.nutritionalInfoPer100g.calories).toBe(222);
    expect(updatedIngredient.nutritionalInfoPer100g.protein).toBe(888);
    expect(updatedIngredient.updatedAt).not.toBe(
      vp.validIngredientProps.updatedAt.toISOString()
    );
  });

  it('should throw NotFoundError when ingredient does not exist', async () => {
    await expect(
      updateIngredientUsecase.execute({
        id: 'non-existent',
        patch: {
          name: 'New Name',
        },
      })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error when calories is  negative', async () => {
    await expect(
      updateIngredientUsecase.execute({
        id: ingredient.id,
        patch: {
          calories: -10,
        },
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw error when protein is negative', async () => {
    await expect(
      updateIngredientUsecase.execute({
        id: ingredient.id,
        patch: { protein: -5 },
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should return IngredientDTO', async () => {
    const updatedIngredient = await updateIngredientUsecase.execute({
      id: ingredient.id,
      patch: {
        name: 'Updated Name',
      },
    });

    expect(updatedIngredient).not.toBeInstanceOf(Ingredient);

    for (const prop of dto.ingredientDTOProperties) {
      expect(updatedIngredient).toHaveProperty(prop);
    }
  });
});
