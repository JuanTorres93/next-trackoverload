import * as vp from '@/../tests/createProps';
import * as externalIngredientRefTestProps from '../../../../../tests/createProps/externalIngredientRefTestProps';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import fs from 'fs/promises';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FileSystemExternalIngredientsRefRepo } from '../FileSystemExternalIngredientsRefRepo';

describe('FileSystemExternalIngredientsRefRepo', () => {
  let repo: FileSystemExternalIngredientsRefRepo;
  let externalIngredientRef: ExternalIngredientRef;
  const testDir = './__test_data__/externalingredientsref';

  beforeEach(async () => {
    repo = new FileSystemExternalIngredientsRefRepo(testDir);
    externalIngredientRef = ExternalIngredientRef.create(
      externalIngredientRefTestProps.validExternalIngredientRefProps,
    );
    await repo.save(externalIngredientRef);
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }
  });

  describe('save', () => {
    it('should save an external ingredient ref to filesystem', async () => {
      const files = await fs.readdir(testDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));
      expect(jsonFiles.length).toBe(1);
    });

    it('should update an existing external ingredient ref', async () => {
      const repoCountBefore = await repo.countForTesting?.();
      expect(repoCountBefore).toBe(1);

      const updatedRef = ExternalIngredientRef.create({
        ...externalIngredientRefTestProps.validExternalIngredientRefProps,
        ingredientId: 'updated-ing',
      });
      await repo.save(updatedRef);

      const repoCountAfter = await repo.countForTesting?.();
      expect(repoCountAfter).toBe(1);

      const fetched = await repo.getByExternalIdAndSource(
        externalIngredientRefTestProps.validExternalIngredientRefProps
          .externalId,
        externalIngredientRefTestProps.validExternalIngredientRefProps.source,
      );
      expect(fetched?.ingredientId).toBe('updated-ing');
    });
  });

  describe('getByExternalIdAndSource', () => {
    it('should retrieve an external ingredient ref by externalId and source', async () => {
      const fetched = await repo.getByExternalIdAndSource(
        externalIngredientRefTestProps.validExternalIngredientRefProps
          .externalId,
        externalIngredientRefTestProps.validExternalIngredientRefProps.source,
      );

      expect(fetched).not.toBeNull();
      expect(fetched!.externalId).toBe(
        externalIngredientRefTestProps.validExternalIngredientRefProps
          .externalId,
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
        'non-existent',
        'NonExistentSource',
      );
      expect(fetched).toBeNull();
    });

    it('should return null if externalId matches but source does not', async () => {
      const fetched = await repo.getByExternalIdAndSource(
        externalIngredientRefTestProps.validExternalIngredientRefProps
          .externalId,
        'DifferentSource',
      );
      expect(fetched).toBeNull();
    });

    it('should return null if source matches but externalId does not', async () => {
      const fetched = await repo.getByExternalIdAndSource(
        'different-id',
        externalIngredientRefTestProps.validExternalIngredientRefProps.source,
      );
      expect(fetched).toBeNull();
    });
  });

  describe('getByExternalIdsAndSource', () => {
    it('should retrieve multiple external ingredient refs by externalIds and source', async () => {
      const ref2 = ExternalIngredientRef.create({
        ...externalIngredientRefTestProps.validExternalIngredientRefProps,
        externalId: 'ext-id-2',
        ingredientId: 'ing-id-2',
      });
      const ref3 = ExternalIngredientRef.create({
        ...externalIngredientRefTestProps.validExternalIngredientRefProps,
        externalId: 'ext-id-3',
        ingredientId: 'ing-id-3',
      });
      await repo.save(ref2);
      await repo.save(ref3);

      const fetched = await repo.getByExternalIdsAndSource(
        [
          externalIngredientRefTestProps.validExternalIngredientRefProps
            .externalId,
          'ext-id-2',
          'ext-id-3',
        ],
        externalIngredientRefTestProps.validExternalIngredientRefProps.source,
      );

      expect(fetched.length).toBe(3);
      expect(fetched.map((r) => r.externalId)).toContain(
        externalIngredientRefTestProps.validExternalIngredientRefProps
          .externalId,
      );
      expect(fetched.map((r) => r.externalId)).toContain('ext-id-2');
      expect(fetched.map((r) => r.externalId)).toContain('ext-id-3');
    });

    it('should return empty array when no external ingredient refs match', async () => {
      const fetched = await repo.getByExternalIdsAndSource(
        ['non-existent-1', 'non-existent-2'],
        externalIngredientRefTestProps.validExternalIngredientRefProps.source,
      );

      expect(fetched).toEqual([]);
    });

    it('should return only matching refs when some externalIds do not exist', async () => {
      const fetched = await repo.getByExternalIdsAndSource(
        [
          externalIngredientRefTestProps.validExternalIngredientRefProps
            .externalId,
          'non-existent-id',
        ],
        externalIngredientRefTestProps.validExternalIngredientRefProps.source,
      );

      expect(fetched.length).toBe(1);
      expect(fetched[0].externalId).toBe(
        externalIngredientRefTestProps.validExternalIngredientRefProps
          .externalId,
      );
    });

    it('should return empty array when source does not match', async () => {
      const fetched = await repo.getByExternalIdsAndSource(
        [
          externalIngredientRefTestProps.validExternalIngredientRefProps
            .externalId,
        ],
        'DifferentSource',
      );

      expect(fetched).toEqual([]);
    });

    it('should return empty array for empty externalIds array', async () => {
      const fetched = await repo.getByExternalIdsAndSource(
        [],
        externalIngredientRefTestProps.validExternalIngredientRefProps.source,
      );

      expect(fetched).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete external ingredient ref by externalId', async () => {
      const repoCountBefore = await repo.countForTesting?.();
      expect(repoCountBefore).toBe(1);

      await repo.delete(
        externalIngredientRefTestProps.validExternalIngredientRefProps
          .externalId,
      );

      const repoCountAfter = await repo.countForTesting?.();
      expect(repoCountAfter).toBe(0);
    });

    it('should delete only the matching externalId, not by ingredientId', async () => {
      const secondRef = ExternalIngredientRef.create({
        ...externalIngredientRefTestProps.validExternalIngredientRefProps,
        externalId: 'another-ref-id',
      });
      await repo.save(secondRef);

      const repoCountBefore = await repo.countForTesting?.();
      expect(repoCountBefore).toBe(2);

      await repo.delete(
        externalIngredientRefTestProps.validExternalIngredientRefProps
          .externalId,
      );

      const repoCountAfter = await repo.countForTesting?.();
      expect(repoCountAfter).toBe(1);

      const remainingRef = await repo.getByExternalIdAndSource(
        'another-ref-id',
        externalIngredientRefTestProps.validExternalIngredientRefProps.source,
      );
      expect(remainingRef).not.toBeNull();
    });

    it('should handle deletion of non-existent externalId gracefully', async () => {
      const repoCountBefore = await repo.countForTesting?.();
      expect(repoCountBefore).toBe(1);

      await repo.delete('non-existent-id');

      const repoCountAfter = await repo.countForTesting?.();
      expect(repoCountAfter).toBe(1);
    });
  });
});
