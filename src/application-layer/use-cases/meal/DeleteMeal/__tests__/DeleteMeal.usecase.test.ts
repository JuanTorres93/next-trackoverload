import * as vp from '@/../tests/createProps';
import { AuthError, NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { User } from '@/domain/entities/user/User';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteMealUsecase } from '../DeleteMeal.usecase';

describe('DeleteMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let deleteMealUsecase: DeleteMealUsecase;
  let user: User;

  beforeEach(async () => {
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    deleteMealUsecase = new DeleteMealUsecase(mealsRepo, usersRepo);

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);
  });

  it('should delete existing meal', async () => {
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

    await deleteMealUsecase.execute({
      id: vp.mealPropsNoIngredientLines.id,
      userId: vp.userId,
    });

    const deletedMeal = await mealsRepo.getMealById(
      vp.mealPropsNoIngredientLines.id
    );
    expect(deletedMeal).toBeNull();
  });

  it('should throw NotFoundError when meal does not exist', async () => {
    await expect(
      deleteMealUsecase.execute({ id: 'non-existent', userId: vp.userId })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw error when trying to delete a meal that does not belong to the user', async () => {
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
      deleteMealUsecase.execute({
        id: vp.mealPropsNoIngredientLines.id,
        userId: 'another-user-id',
      })
    ).rejects.toThrow(AuthError);
  });

  it('should throw error if user does not exist', async () => {
    await expect(
      deleteMealUsecase.execute({ id: 'some-id', userId: 'non-existent' })
    ).rejects.toThrow(NotFoundError);
    await expect(
      deleteMealUsecase.execute({ id: 'some-id', userId: 'non-existent' })
    ).rejects.toThrow(/DeleteMealUsecase.*user.*not.*found/);
  });
});
