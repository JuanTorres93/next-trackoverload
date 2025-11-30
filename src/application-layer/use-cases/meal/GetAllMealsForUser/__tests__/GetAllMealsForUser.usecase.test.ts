import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { User } from '@/domain/entities/user/User';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetAllMealsForUserUsecase } from '../GetAllMealsForUser.usecase';

describe('GetAllMealsUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let getAllMealsUsecase: GetAllMealsForUserUsecase;
  let user: User;

  beforeEach(async () => {
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    getAllMealsUsecase = new GetAllMealsForUserUsecase(mealsRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);
  });

  it('should return all meals', async () => {
    const ingredient1 = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredient2 = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredientLine1 = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: ingredient1,
    });

    const ingredientLine2 = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
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
      ...vp.ingredientLineRecipePropsNoIngredient,
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

  it('should throw error if user does not exist', async () => {
    await expect(
      getAllMealsUsecase.execute({ userId: 'non-existent' })
    ).rejects.toThrow(NotFoundError);
    await expect(
      getAllMealsUsecase.execute({ userId: 'non-existent' })
    ).rejects.toThrow(/GetAllMealsForUserUsecase.*user.*not.*found/);
  });
});
