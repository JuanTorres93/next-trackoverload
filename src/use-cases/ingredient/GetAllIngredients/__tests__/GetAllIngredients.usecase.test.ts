import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllIngredientsUsecase } from '../GetAllIngredients.usecase';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';

describe('GetAllIngredientsUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let getAllIngredientsUsecase: GetAllIngredientsUsecase;

  beforeEach(() => {
    ingredientsRepo = new MemoryIngredientsRepo();
    getAllIngredientsUsecase = new GetAllIngredientsUsecase(ingredientsRepo);
  });

  it('should return all ingredients', async () => {
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

    const ingredients = await getAllIngredientsUsecase.execute();

    expect(ingredients).toHaveLength(2);
    expect(ingredients).toContain(ingredient1);
    expect(ingredients).toContain(ingredient2);
  });

  it('should return empty array when no ingredients exist', async () => {
    const ingredients = await getAllIngredientsUsecase.execute();

    expect(ingredients).toHaveLength(0);
  });
});
