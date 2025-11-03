import { describe, expect, it } from 'vitest';
import { FileSystemIngredientsRepo } from '../FileSystemIngredientsRepo';

describe('FileSystemIngredientsRepo - getByFuzzyName integration test', () => {
  const repo = new FileSystemIngredientsRepo();

  it('should load ingredients from file system', async () => {
    const allIngredients = await repo.getAllIngredients();
    expect(allIngredients.length).toBeGreaterThan(0);

    // Verify we have the expected ingredients
    const names = allIngredients.map((ing) => ing.name);
    expect(names).toContain('Queso Marcilla');
    expect(names).toContain('Pechuga de Pollo');
    expect(names).toContain('Arroz Integral');
  });

  it('should find ingredients by fuzzy name search using real data', async () => {
    // Test search for "pollo" - should find "Pechuga de Pollo"
    const polloResults = await repo.getByFuzzyName('pollo');
    expect(polloResults).toHaveLength(1);
    expect(polloResults[0].name).toBe('Pechuga de Pollo');

    // Test search for "que" - should find "Queso Marcilla"
    const queResults = await repo.getByFuzzyName('que');
    expect(queResults).toHaveLength(1);
    expect(queResults[0].name).toBe('Queso Marcilla');

    // Test with partial match - "arroz" should find "Arroz Integral"
    const arrozResults = await repo.getByFuzzyName('arroz');
    expect(arrozResults).toHaveLength(1);
    expect(arrozResults[0].name).toBe('Arroz Integral');

    // Test case insensitive - "salm" should find "Salmón"
    const salmonResults = await repo.getByFuzzyName('salm');
    expect(salmonResults).toHaveLength(1);
    expect(salmonResults[0].name).toBe('Salmón');

    // Test with exact match
    const exactResults = await repo.getByFuzzyName('Brócoli');
    expect(exactResults).toHaveLength(1);
    expect(exactResults[0].name).toBe('Brócoli');

    // Test empty search - should return empty array
    const emptyResults = await repo.getByFuzzyName('');
    expect(emptyResults).toHaveLength(0);

    // Test non-existent ingredient
    const nonExistentResults = await repo.getByFuzzyName('pizza');
    expect(nonExistentResults).toHaveLength(0);

    // Test whitespace handling
    const whitespaceResults = await repo.getByFuzzyName('  batata  ');
    expect(whitespaceResults).toHaveLength(1);
    expect(whitespaceResults[0].name).toBe('Batata');
  });
});
