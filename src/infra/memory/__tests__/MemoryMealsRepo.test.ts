import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryMealsRepo } from '../MemoryMealsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import * as vp from '@/../tests/createProps';

const validIngredientProps = {
  ...vp.validIngredientProps,
  nutritionalInfoPer100g: {
    calories: 165,
    protein: 25,
  },
};

describe('MemoryMealsRepo', () => {
  let repo: MemoryMealsRepo;
  let meal: Meal;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;

  beforeEach(async () => {
    repo = new MemoryMealsRepo();
    ingredient = Ingredient.create(validIngredientProps);

    ingredientLine = IngredientLine.create({
      ...vp.ingredientLinePropsNoIngredient,
      ingredient,
      quantityInGrams: 150,
    });

    meal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      id: '1',
      name: 'Grilled Chicken',
      ingredientLines: [ingredientLine],
    });

    await repo.saveMeal(meal);
  });

  it('should save a meal', async () => {
    const newMeal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      name: 'Chicken Salad',
      ingredientLines: [ingredientLine],
    });
    await repo.saveMeal(newMeal);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(2);
    expect(allMeals[1].name).toBe('Chicken Salad');
  });

  it('should update an existing meal', async () => {
    const updatedMeal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      id: '1',
      name: 'Updated Grilled Chicken',
      ingredientLines: [ingredientLine],
    });
    await repo.saveMeal(updatedMeal);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(1);
    expect(allMeals[0].name).toBe('Updated Grilled Chicken');
  });

  it('should retrieve a meal by ID', async () => {
    const fetchedMeal = await repo.getMealById('1');
    expect(fetchedMeal).not.toBeNull();
    expect(fetchedMeal?.name).toBe('Grilled Chicken');
  });

  it('should retrieve all meals by a user', async () => {
    const userMeals = await repo.getAllMealsForUser(vp.userId);
    expect(userMeals.length).toBe(1);
    expect(userMeals[0].id).toBe('1');
    expect(userMeals[0].name).toBe('Grilled Chicken');
  });

  it('should retrieve a meal by ID for a user', async () => {
    const fetchedMeal = await repo.getMealByIdForUser('1', vp.userId);
    expect(fetchedMeal).not.toBeNull();
    expect(fetchedMeal?.name).toBe('Grilled Chicken');
  });

  it('should return null for non-existent meal ID', async () => {
    const fetchedMeal = await repo.getMealById('non-existent-id');
    expect(fetchedMeal).toBeNull();
  });

  it('should delete a meal by ID', async () => {
    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(1);

    await repo.deleteMeal('1');

    const allMealsAfterDeletion = await repo.getAllMeals();
    expect(allMealsAfterDeletion.length).toBe(0);
  });
});
