import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllMealsForUserUsecase } from '../GetAllMealsForUser.usecase';

describe('GetAllMealsUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let getAllMealsUsecase: GetAllMealsForUserUsecase;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    getAllMealsUsecase = new GetAllMealsForUserUsecase(mealsRepo);
  });

  it('should return all meals', async () => {
    const ingredient1 = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredient2 = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredientLine1 = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: ingredient1,
    });

    const ingredientLine2 = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: ingredient2,
    });

    const meal1 = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      id: '1',
      name: 'Protein Meal',
      ingredientLines: [ingredientLine1],
    });

    const meal2 = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      id: '2',
      name: 'Carb Meal',
      ingredientLines: [ingredientLine2],
    });

    await mealsRepo.saveMeal(meal1);
    await mealsRepo.saveMeal(meal2);

    const meals = await getAllMealsUsecase.execute({
      userId: vp.userId,
    });

    const mealIds = meals.map((m) => m.id);

    expect(meals).toHaveLength(2);
    expect(mealIds).toContain(meal1.id);
    expect(mealIds).toContain(meal2.id);
  });

  it('should return an array of MealDTO', async () => {
    const ingredient1 = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredientLine1 = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient: ingredient1,
    });

    const meal1 = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      name: 'Protein Meal',
      ingredientLines: [ingredientLine1],
    });

    await mealsRepo.saveMeal(meal1);

    const meals = await getAllMealsUsecase.execute({
      userId: vp.userId,
    });

    expect(meals).toHaveLength(1);

    for (const meal of meals) {
      expect(meal).not.toBeInstanceOf(Meal);

      for (const prop of dto.mealDTOProperties) {
        expect(meal).toHaveProperty(prop);
      }
    }
  });

  it('should return empty array when no meals exist', async () => {
    const meals = await getAllMealsUsecase.execute({ userId: vp.userId });

    expect(meals).toHaveLength(0);
    expect(meals).toEqual([]);
  });
});
