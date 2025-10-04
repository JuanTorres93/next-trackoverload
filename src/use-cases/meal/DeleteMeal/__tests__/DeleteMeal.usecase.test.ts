import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteMealUsecase } from '../DeleteMeal.usecase';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';

describe('DeleteMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let deleteMealUsecase: DeleteMealUsecase;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    deleteMealUsecase = new DeleteMealUsecase(mealsRepo);
  });

  it('should delete existing meal', async () => {
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

    const ingredientLine = IngredientLine.create({
      id: '1',
      ingredient,
      quantityInGrams: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const meal = Meal.create({
      id: '1',
      name: 'Protein Meal',
      ingredientLines: [ingredientLine],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await mealsRepo.saveMeal(meal);

    await deleteMealUsecase.execute({ id: '1' });

    const deletedMeal = await mealsRepo.getMealById('1');
    expect(deletedMeal).toBeNull();
  });

  it('should throw NotFoundError when meal does not exist', async () => {
    await expect(
      deleteMealUsecase.execute({ id: 'non-existent' })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined, ''];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        deleteMealUsecase.execute({ id: invalidId })
      ).rejects.toThrow(ValidationError);
    }
  });
});
