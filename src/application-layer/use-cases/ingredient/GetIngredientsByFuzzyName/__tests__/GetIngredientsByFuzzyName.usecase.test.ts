import * as vp from '@/../tests/createProps';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as dto from '@/../tests/dtoProperties';
import { ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { MemoryIngredientsRepo } from '@/infra/repos/memory/MemoryIngredientsRepo';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  GetIngredientsByFuzzyNameInput,
  GetIngredientsByFuzzyNameUsecase,
} from '../GetIngredientsByFuzzyName.usecase';

describe('GetIngredientsByFuzzyNameUsecase', () => {
  let ingredientsRepo: MemoryIngredientsRepo;
  let getIngredientsByFuzzyNameUsecase: GetIngredientsByFuzzyNameUsecase;

  beforeEach(async () => {
    ingredientsRepo = new MemoryIngredientsRepo();
    getIngredientsByFuzzyNameUsecase = new GetIngredientsByFuzzyNameUsecase(
      ingredientsRepo,
    );

    // Setup test ingredients
    const ingredients = [
      Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        id: '1',
        name: 'Chicken Breast',
      }),
      Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        id: '2',
        name: 'Brown Rice',
      }),
      Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        id: '3',
        name: 'Broccoli',
      }),
      Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        id: '4',
        name: 'Salmon',
      }),
      Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        id: '5',
        name: 'Chicken Thigh',
      }),
    ];

    for (const ingredient of ingredients) {
      await ingredientsRepo.saveIngredient(ingredient);
    }
  });

  describe('successful searches', () => {
    it('should return ingredients matching exact name', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: 'Chicken Breast' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Chicken Breast');
    });

    it('should return ingredients matching partial name (case insensitive)', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: 'chicken' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(2);
      const names = results.map((r) => r.name);
      expect(names).toContain('Chicken Breast');
      expect(names).toContain('Chicken Thigh');
    });

    it('should return ingredients matching substring (different case)', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: 'BROWN' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Brown Rice');
    });

    it('should return ingredients with mixed case search', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: 'BrOcCoLi' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Broccoli');
    });

    it('should return multiple ingredients when search matches multiple names', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: 'c' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results.length).toBeGreaterThanOrEqual(3); // Chicken Breast, Chicken Thigh, Broccoli, Brown Rice
      const names = results.map((r) => r.name);
      expect(names).toContain('Chicken Breast');
      expect(names).toContain('Chicken Thigh');
      expect(names).toContain('Broccoli');
    });

    it('should handle leading and trailing whitespace', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: '  salmon  ' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Salmon');
    });
  });

  describe('empty results', () => {
    it('should return empty array for non-matching search term', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: 'pizza' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(0);
    });

    it('should return empty array for empty string', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: '' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(0);
    });

    it('should return empty array for whitespace-only string', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: '   ' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(0);
    });
  });

  describe('Errors', () => {
    it('should throw ValidationError when name is not provided', async () => {
      const input = {} as GetIngredientsByFuzzyNameInput;

      await expect(
        getIngredientsByFuzzyNameUsecase.execute(input),
      ).rejects.toThrow(ValidationError);

      await expect(
        getIngredientsByFuzzyNameUsecase.execute(input),
      ).rejects.toThrow(/GetIngredientsByFuzzyName.*name.* required/);
    });

    it('should throw ValidationError when name is null', async () => {
      const input = { name: null } as unknown as GetIngredientsByFuzzyNameInput;

      await expect(
        getIngredientsByFuzzyNameUsecase.execute(input),
      ).rejects.toThrow(ValidationError);

      await expect(
        getIngredientsByFuzzyNameUsecase.execute(input),
      ).rejects.toThrow(/GetIngredientsByFuzzyName.*name.* required/);
    });

    it('should throw ValidationError when name is not a string', async () => {
      const input = { name: 123 } as unknown as GetIngredientsByFuzzyNameInput;

      await expect(
        getIngredientsByFuzzyNameUsecase.execute(input),
      ).rejects.toThrow(ValidationError);

      await expect(
        getIngredientsByFuzzyNameUsecase.execute(input),
      ).rejects.toThrow(/GetIngredientsByFuzzyName.*name.* must.*string/);
    });

    it('should throw ValidationError when input is undefined', async () => {
      await expect(
        getIngredientsByFuzzyNameUsecase.execute(
          // @ts-expect-error Testing undefined input
          undefined,
        ),
      ).rejects.toThrow(ValidationError);

      await expect(
        getIngredientsByFuzzyNameUsecase.execute(
          // @ts-expect-error Testing undefined input
          undefined,
        ),
      ).rejects.toThrow(/GetIngredientsByFuzzyName.*name.* required/);
    });
  });

  describe('DTO validation', () => {
    it('should return an array of IngredientDTO objects', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: 'chicken' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(2);

      for (const result of results) {
        // Ensure it's not a domain entity
        expect(result).not.toBeInstanceOf(Ingredient);

        // Ensure it has all required DTO properties
        for (const prop of dto.ingredientDTOProperties) {
          expect(result).toHaveProperty(prop);
        }
      }
    });

    it('should return IngredientDTO with correct data transformation', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: 'Salmon' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(1);

      const salmonDTO = results[0];
      expect(salmonDTO.name).toBe('Salmon');
      expect(salmonDTO.id).toBe('4');

      // Verify dates are ISO strings
      expect(() => new Date(salmonDTO.createdAt)).not.toThrow();
      expect(() => new Date(salmonDTO.updatedAt)).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should work when repository is empty', async () => {
      const emptyRepo = new MemoryIngredientsRepo();
      const emptyUsecase = new GetIngredientsByFuzzyNameUsecase(emptyRepo);

      const input: GetIngredientsByFuzzyNameInput = { name: 'anything' };
      const results = await emptyUsecase.execute(input);

      expect(results).toHaveLength(0);
    });

    it('should handle special characters in search term', async () => {
      const input: GetIngredientsByFuzzyNameInput = { name: '@#$%' };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(0);
    });

    it('should handle very long search terms', async () => {
      const longName = 'a'.repeat(1000);
      const input: GetIngredientsByFuzzyNameInput = { name: longName };
      const results = await getIngredientsByFuzzyNameUsecase.execute(input);

      expect(results).toHaveLength(0);
    });
  });
});
