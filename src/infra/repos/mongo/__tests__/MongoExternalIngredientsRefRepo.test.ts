import * as externalIngredientRefTestProps from '../../../../../tests/createProps/externalIngredientRefTestProps';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { MongoExternalIngredientsRefRepo } from '../MongoExternalIngredientsRefRepo';
import {
  setupMongoTestDB,
  teardownMongoTestDB,
  clearMongoTestDB,
} from './setupMongoTestDB';

describe('MongoExternalIngredientsRefRepo', () => {
  let repo: MongoExternalIngredientsRefRepo;
  let externalIngredientRef: ExternalIngredientRef;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    repo = new MongoExternalIngredientsRefRepo();
    externalIngredientRef = ExternalIngredientRef.create(
      externalIngredientRefTestProps.validExternalIngredientRefProps,
    );
    await repo.save(externalIngredientRef);
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  it('should save an external ingredient ref', async () => {
    const newExternalIngredientRef = ExternalIngredientRef.create({
      ...externalIngredientRefTestProps.validExternalIngredientRefProps,
      externalId: 'ext-ing-2',
    });
    await repo.save(newExternalIngredientRef);

    const fetched = await repo.getByExternalIdAndSource(
      'ext-ing-2',
      'openfoodfacts',
    );
    expect(fetched).not.toBeNull();
    expect(fetched!.externalId).toBe('ext-ing-2');
  });

  it('should update an existing external ingredient ref', async () => {
    // Create a new ref with the same external ID and source but different ingredient ID
    const updatedRef = ExternalIngredientRef.create({
      ...externalIngredientRefTestProps.validExternalIngredientRefProps,
      ingredientId: 'new-ingredient-id',
    });

    await repo.save(updatedRef);

    const fetched = await repo.getByExternalIdAndSource(
      externalIngredientRefTestProps.validExternalIngredientRefProps.externalId,
      externalIngredientRefTestProps.validExternalIngredientRefProps.source,
    );

    expect(fetched).not.toBeNull();
    expect(fetched!.ingredientId).toBe('new-ingredient-id');
  });

  it('should retrieve an external ingredient ref by external ID and source', async () => {
    const fetched = await repo.getByExternalIdAndSource(
      externalIngredientRefTestProps.validExternalIngredientRefProps.externalId,
      externalIngredientRefTestProps.validExternalIngredientRefProps.source,
    );

    expect(fetched).not.toBeNull();
    expect(fetched!.externalId).toBe(
      externalIngredientRefTestProps.validExternalIngredientRefProps.externalId,
    );
    expect(fetched!.source).toBe(
      externalIngredientRefTestProps.validExternalIngredientRefProps.source,
    );
    expect(fetched!.ingredientId).toBe(
      externalIngredientRefTestProps.validExternalIngredientRefProps
        .ingredientId,
    );
  });

  it('should return null for non-existent external ingredient ref', async () => {
    const fetched = await repo.getByExternalIdAndSource(
      'non-existent-id',
      'openfoodfacts',
    );

    expect(fetched).toBeNull();
  });

  describe('getByExternalIdsAndSource', () => {
    beforeEach(async () => {
      await clearMongoTestDB();
      repo = new MongoExternalIngredientsRefRepo();

      const refs = [
        ExternalIngredientRef.create({
          ...externalIngredientRefTestProps.validExternalIngredientRefProps,
          externalId: 'ext-id-1',
          ingredientId: 'ing-id-1',
        }),

        ExternalIngredientRef.create({
          ...externalIngredientRefTestProps.validExternalIngredientRefProps,
          externalId: 'ext-id-2',
          ingredientId: 'ing-id-2',
        }),

        ExternalIngredientRef.create({
          ...externalIngredientRefTestProps.validExternalIngredientRefProps,
          externalId: 'ext-id-3',
          ingredientId: 'ing-id-3',
        }),
      ];

      for (const ref of refs) {
        await repo.save(ref);
      }
    });

    it('should retrieve multiple external ingredient refs by their external IDs', async () => {
      const refs = await repo.getByExternalIdsAndSource(
        ['ext-id-1', 'ext-id-3'],
        'openfoodfacts',
      );

      expect(refs).toHaveLength(2);
      expect(refs.map((r) => r.externalId)).toContain('ext-id-1');
      expect(refs.map((r) => r.externalId)).toContain('ext-id-3');
    });

    it('should retrieve single external ingredient ref when only one ID is provided', async () => {
      const refs = await repo.getByExternalIdsAndSource(
        ['ext-id-2'],
        'openfoodfacts',
      );

      expect(refs).toHaveLength(1);
      expect(refs[0].externalId).toBe('ext-id-2');
      expect(refs[0].ingredientId).toBe('ing-id-2');
    });

    it('should return empty array when provided IDs do not exist', async () => {
      const refs = await repo.getByExternalIdsAndSource(
        ['non-existent-1', 'non-existent-2'],
        'openfoodfacts',
      );

      expect(refs).toHaveLength(0);
    });

    it('should return empty array when provided with empty array', async () => {
      const refs = await repo.getByExternalIdsAndSource([], 'openfoodfacts');

      expect(refs).toHaveLength(0);
    });

    it('should filter out non-existent IDs and return only existing ones', async () => {
      const refs = await repo.getByExternalIdsAndSource(
        ['ext-id-1', 'non-existent', 'ext-id-2'],
        'openfoodfacts',
      );

      expect(refs).toHaveLength(2);
      expect(refs.map((r) => r.externalId)).toContain('ext-id-1');
      expect(refs.map((r) => r.externalId)).toContain('ext-id-2');
    });

    it('should retrieve all external ingredient refs when all IDs are provided', async () => {
      const refs = await repo.getByExternalIdsAndSource(
        ['ext-id-1', 'ext-id-2', 'ext-id-3'],
        'openfoodfacts',
      );

      expect(refs).toHaveLength(3);
    });

    it('should only return refs matching the specified source', async () => {
      const refs = await repo.getByExternalIdsAndSource(
        ['ext-id-1', 'ext-id-2'],
        'openfoodfacts',
      );

      expect(refs).toHaveLength(2);
      refs.forEach((ref) => {
        expect(ref.source).toBe('openfoodfacts');
      });
    });
  });

  it('should delete an external ingredient ref by external ID', async () => {
    const fetchedBefore = await repo.getByExternalIdAndSource(
      externalIngredientRefTestProps.validExternalIngredientRefProps.externalId,
      externalIngredientRefTestProps.validExternalIngredientRefProps.source,
    );
    expect(fetchedBefore).not.toBeNull();

    await repo.delete(
      externalIngredientRefTestProps.validExternalIngredientRefProps.externalId,
    );

    const fetchedAfter = await repo.getByExternalIdAndSource(
      externalIngredientRefTestProps.validExternalIngredientRefProps.externalId,
      externalIngredientRefTestProps.validExternalIngredientRefProps.source,
    );
    expect(fetchedAfter).toBeNull();
  });

  it('should return null when trying to delete a non-existent external ingredient ref', async () => {
    await expect(repo.delete('non-existent-id')).rejects.toEqual(null);
  });
});
