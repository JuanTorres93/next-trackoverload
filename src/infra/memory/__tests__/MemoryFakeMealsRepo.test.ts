import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryFakeMealsRepo } from '../MemoryFakeMealsRepo';
import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';

const validFakeMealProps = {
  id: '1',
  name: 'Protein Shake',
  calories: 250,
  protein: 30,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

describe('MemoryFakeMealsRepo', () => {
  let repo: MemoryFakeMealsRepo;
  let fakeMeal: FakeMeal;

  beforeEach(async () => {
    repo = new MemoryFakeMealsRepo();
    fakeMeal = FakeMeal.create(validFakeMealProps);
    await repo.saveFakeMeal(fakeMeal);
  });

  it('should save a fake meal', async () => {
    const newFakeMeal = FakeMeal.create({
      id: '2',
      name: 'Energy Bar',
      calories: 200,
      protein: 15,
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-02'),
    });
    await repo.saveFakeMeal(newFakeMeal);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(2);
    expect(allFakeMeals[1].name).toBe('Energy Bar');
  });

  it('should update an existing fake meal', async () => {
    const updatedFakeMeal = FakeMeal.create({
      ...validFakeMealProps,
      name: 'Updated Protein Shake',
      updatedAt: new Date('2023-01-03'),
    });
    await repo.saveFakeMeal(updatedFakeMeal);

    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(1);
    expect(allFakeMeals[0].name).toBe('Updated Protein Shake');
  });

  it('should retrieve a fake meal by ID', async () => {
    const fetchedFakeMeal = await repo.getFakeMealById('1');
    expect(fetchedFakeMeal).not.toBeNull();
    expect(fetchedFakeMeal?.name).toBe('Protein Shake');
  });

  it('should return null for non-existent fake meal ID', async () => {
    const fetchedFakeMeal = await repo.getFakeMealById('non-existent-id');
    expect(fetchedFakeMeal).toBeNull();
  });

  it('should delete a fake meal by ID', async () => {
    const allFakeMeals = await repo.getAllFakeMeals();
    expect(allFakeMeals.length).toBe(1);

    await repo.deleteFakeMeal('1');

    const allFakeMealsAfterDeletion = await repo.getAllFakeMeals();
    expect(allFakeMealsAfterDeletion.length).toBe(0);
  });
});
