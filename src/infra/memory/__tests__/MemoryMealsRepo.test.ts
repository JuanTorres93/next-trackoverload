import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryMealsRepo } from '../MemoryMealsRepo';
import { Meal } from '@/domain/entities/meal/Meal';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { NotFoundError } from '@/domain/common/errors';

const validIngredientProps = {
  id: '1',
  name: 'Chicken Breast',
  nutritionalInfoPer100g: {
    calories: 165,
    protein: 25,
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
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
      id: '1',
      ingredient,
      quantityInGrams: 150,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    meal = Meal.create({
      id: '1',
      name: 'Grilled Chicken',
      ingredientLines: [ingredientLine],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    });

    await repo.saveMeal(meal);
  });

  it('should save a meal', async () => {
    const newMeal = Meal.create({
      id: '2',
      name: 'Chicken Salad',
      ingredientLines: [ingredientLine],
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveMeal(newMeal);

    const allMeals = await repo.getAllMeals();
    expect(allMeals.length).toBe(2);
    expect(allMeals[1].name).toBe('Chicken Salad');
  });

  it('should update an existing meal', async () => {
    const updatedMeal = Meal.create({
      id: '1',
      name: 'Updated Grilled Chicken',
      ingredientLines: [ingredientLine],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-03'),
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

  it('should throw NotFoundError when deleting non-existent meal', async () => {
    await expect(repo.deleteMeal('non-existent-id')).rejects.toThrow(
      NotFoundError
    );
  });
});
