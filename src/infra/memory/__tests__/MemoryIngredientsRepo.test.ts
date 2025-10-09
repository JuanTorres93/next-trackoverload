import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryIngredientsRepo } from '../MemoryIngredientsRepo';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import * as vp from '@/../tests/createProps';

describe('MemoryIngredientsRepo', () => {
  let repo: MemoryIngredientsRepo;
  let ingredient: Ingredient;

  beforeEach(async () => {
    repo = new MemoryIngredientsRepo();
    ingredient = Ingredient.create(vp.validIngredientProps);
    await repo.saveIngredient(ingredient);
  });

  it('should save an ingredient', async () => {
    const newIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      id: '2',
      name: 'Rice',
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveIngredient(newIngredient);

    const allIngredients = await repo.getAllIngredients();
    expect(allIngredients.length).toBe(2);
    expect(allIngredients[1].name).toBe('Rice');
  });

  it('should update an existing ingredient', async () => {
    const updatedIngredient = Ingredient.create({
      ...vp.validIngredientProps,
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
      vp.validIngredientProps.id
    );
    expect(fetchedIngredient).not.toBeNull();
    expect(fetchedIngredient?.name).toBe(vp.validIngredientProps.name);
  });

  it('should return null for non-existent ingredient ID', async () => {
    const fetchedIngredient = await repo.getIngredientById('non-existent-id');
    expect(fetchedIngredient).toBeNull();
  });

  it('should delete an ingredient by ID', async () => {
    const allIngredients = await repo.getAllIngredients();
    expect(allIngredients.length).toBe(1);

    await repo.deleteIngredient(vp.validIngredientProps.id);

    const allIngredientsAfterDeletion = await repo.getAllIngredients();
    expect(allIngredientsAfterDeletion.length).toBe(0);
  });
});
