import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { AuthError, NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { User } from '@/domain/entities/user/User';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetMealByIdForUserUsecase } from '../GetMealByIdForUser.usecase';

describe('GetMealByIdUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let getMealByIdUsecase: GetMealByIdForUserUsecase;
  let user: User;

  beforeEach(async () => {
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    getMealByIdUsecase = new GetMealByIdForUserUsecase(mealsRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);
  });

  it('should return meal when found', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient,
    });

    const meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await mealsRepo.saveMeal(meal);

    const result = await getMealByIdUsecase.execute({
      id: vp.mealPropsNoIngredientLines.id,
      userId: vp.userId,
    });

    expect(result).not.toBeNull();
    expect(result?.id).toBe(meal.id);
    expect(result?.name).toBe(meal.name);
  });

  it('should return MealDTO when meal found', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient,
    });

    const meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await mealsRepo.saveMeal(meal);

    const result = await getMealByIdUsecase.execute({
      id: vp.mealPropsNoIngredientLines.id,
      userId: vp.userId,
    });

    expect(result).not.toBeNull();
    expect(result).not.toBeInstanceOf(Meal);

    for (const prop of dto.mealDTOProperties) {
      expect(result).toHaveProperty(prop);
    }
  });

  it('should return null when meal not found', async () => {
    const result = await getMealByIdUsecase.execute({
      id: 'non-existent',
      userId: vp.userId,
    });

    expect(result).toBeNull();
  });

  it("should throw error when trying to read another user's meal", async () => {
    const anotherUser = User.create({
      ...vp.validUserProps,
      id: 'another-user-id',
    });
    await usersRepo.saveUser(anotherUser);

    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient,
    });

    const meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await mealsRepo.saveMeal(meal);

    await expect(
      getMealByIdUsecase.execute({
        id: vp.mealPropsNoIngredientLines.id,
        userId: 'another-user-id',
      })
    ).rejects.toThrow(AuthError);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      getMealByIdUsecase.execute({ id: 'some-id', userId: 'non-existent' })
    ).rejects.toThrow(NotFoundError);
    await expect(
      getMealByIdUsecase.execute({ id: 'some-id', userId: 'non-existent' })
    ).rejects.toThrow(/GetMealByIdForUserUsecase.*user.*not.*found/);
  });
});
