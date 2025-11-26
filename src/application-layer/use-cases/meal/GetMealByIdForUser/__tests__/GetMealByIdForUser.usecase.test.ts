import { beforeEach, describe, expect, it } from 'vitest';
import { GetMealByIdForUserUsecase } from '../GetMealByIdForUser.usecase';
import { MemoryMealsRepo } from '@/infra/memory/MemoryMealsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { AuthError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('GetMealByIdUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let getMealByIdUsecase: GetMealByIdForUserUsecase;

  beforeEach(() => {
    mealsRepo = new MemoryMealsRepo();
    getMealByIdUsecase = new GetMealByIdForUserUsecase(mealsRepo);
  });

  it('should return meal when found', async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient,
    });

    const meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await mealsRepo.saveMeal(meal);

    const result = await getMealByIdUsecase.execute({
      id: vp.mealPropsNoIngredientLines.id.value,
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
      ...vp.ingredientLinePropsNoIngredient,
      ingredient,
    });

    const meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await mealsRepo.saveMeal(meal);

    const result = await getMealByIdUsecase.execute({
      id: vp.mealPropsNoIngredientLines.id.value,
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

  it('should throw error when id is invalid', async () => {
    const invalidIds = [true, 4, null, undefined, ''];

    for (const invalidId of invalidIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        getMealByIdUsecase.execute({ id: invalidId })
      ).rejects.toThrow(ValidationError);
    }
  });

  it('should throw error when userId is invalid', async () => {
    const invalidUserIds = [
      true,
      4,
      null,
      undefined,
      '',
      '   ',
      '\n',
      '\t',
      '\r',
      false,
      0,
      [],
      {},
    ];

    for (const invalidUserId of invalidUserIds) {
      await expect(
        // @ts-expect-error Testing invalid inputs
        getMealByIdUsecase.execute({ id: 'user-id', userId: invalidUserId })
      ).rejects.toThrow(ValidationError);
    }
  });

  it("should throw error when trying to read another user's meal", async () => {
    const ingredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const ingredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient,
    });

    const meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    await mealsRepo.saveMeal(meal);

    await expect(
      getMealByIdUsecase.execute({
        id: vp.mealPropsNoIngredientLines.id.value,
        userId: 'another-user-id',
      })
    ).rejects.toThrow(AuthError);
  });
});
