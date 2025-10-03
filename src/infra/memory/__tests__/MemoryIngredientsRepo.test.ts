import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryIngredientsRepo } from '../MemoryIngredientsRepo';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
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

describe('MemoryIngredientsRepo', () => {
  let repo: MemoryIngredientsRepo;
  let ingredient: Ingredient;

  beforeEach(async () => {
    repo = new MemoryIngredientsRepo();
    ingredient = Ingredient.create(validIngredientProps);
    await repo.saveIngredient(ingredient);
  });

  it('should save an ingredient', async () => {
    const newIngredient = Ingredient.create({
      id: '2',
      name: 'Rice',
      nutritionalInfoPer100g: {
        calories: 130,
        protein: 2.7,
      },
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveIngredient(newIngredient);

    const allIngredients = await repo.getAllIngredients();
    expect(allIngredients.length).toBe(2);
    expect(allIngredients[1].name).toBe('Rice');
  });

  it('should update an existing ingredient', async () => {
    const updatedIngredient = Ingredient.create({
      ...validIngredientProps,
      name: 'Updated Chicken Breast',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveIngredient(updatedIngredient);

    const allIngredients = await repo.getAllIngredients();
    expect(allIngredients.length).toBe(1);
    expect(allIngredients[0].name).toBe('Updated Chicken Breast');
  });

  it('should retrieve an ingredient by ID', async () => {
    const fetchedIngredient = await repo.getIngredientById(
      validIngredientProps.id
    );
    expect(fetchedIngredient).not.toBeNull();
    expect(fetchedIngredient?.name).toBe(validIngredientProps.name);
  });

  it('should return null for non-existent ingredient ID', async () => {
    const fetchedIngredient = await repo.getIngredientById('non-existent-id');
    expect(fetchedIngredient).toBeNull();
  });

  it('should delete an ingredient by ID', async () => {
    const allIngredients = await repo.getAllIngredients();
    expect(allIngredients.length).toBe(1);

    await repo.deleteIngredient(validIngredientProps.id);

    const allIngredientsAfterDeletion = await repo.getAllIngredients();
    expect(allIngredientsAfterDeletion.length).toBe(0);
  });

  it('should throw NotFoundError when deleting non-existent ingredient', async () => {
    await expect(repo.deleteIngredient('non-existent-id')).rejects.toThrow(
      NotFoundError
    );
  });
});
