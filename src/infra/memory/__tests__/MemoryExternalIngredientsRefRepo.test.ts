import * as vp from '@/../tests/createProps';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryExternalIngredientsRefRepo } from '../MemoryExternalIngredientsRefRepo';

describe('MemoryExternalIngredientsRefRepo', () => {
  let repo: MemoryExternalIngredientsRefRepo;
  let externalIngredientRef: ExternalIngredientRef;

  beforeEach(async () => {
    repo = new MemoryExternalIngredientsRefRepo();
    externalIngredientRef = ExternalIngredientRef.create(
      vp.validExternalIngredientRefProps
    );
    await repo.save(externalIngredientRef);
  });

  describe('save', () => {
    it('should save an external ingredient ref', async () => {
      const allRefs = repo.getAllForTesting();
      expect(allRefs.length).toBe(1);
    });

    it('should update an existing external ingredient ref', async () => {
      const updatedRef = ExternalIngredientRef.create({
        ...vp.validExternalIngredientRefProps,
        ingredientId: 'updated-ing',
      });
      await repo.save(updatedRef);

      const allRefs = repo.getAllForTesting();
      expect(allRefs.length).toBe(1);
      expect(allRefs[0].ingredientId).toBe('updated-ing');
    });
  });

  describe('getByExternalIdAndSource', () => {
    it('should retrieve an external ingredient ref by externalId and source', async () => {
      const fetched = await repo.getByExternalIdAndSource(
        vp.validExternalIngredientRefProps.externalId,
        vp.validExternalIngredientRefProps.source
      );

      expect(fetched).not.toBeNull();
      expect(fetched!.externalId).toBe(
        vp.validExternalIngredientRefProps.externalId
      );
      expect(fetched!.source).toBe(vp.validExternalIngredientRefProps.source);
    });

    it('should return null for non-existent external ingredient ref', async () => {
      const fetched = await repo.getByExternalIdAndSource(
        'non-existent',
        'NonExistentSource'
      );
      expect(fetched).toBeNull();
    });

    it('should return null if externalId matches but source does not', async () => {
      const fetched = await repo.getByExternalIdAndSource(
        vp.validExternalIngredientRefProps.externalId,
        'DifferentSource'
      );
      expect(fetched).toBeNull();
    });

    it('should return null if source matches but externalId does not', async () => {
      const fetched = await repo.getByExternalIdAndSource(
        'different-id',
        vp.validExternalIngredientRefProps.source
      );
      expect(fetched).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an external ingredient ref by externalId', async () => {
      await repo.delete(vp.validExternalIngredientRefProps.externalId);

      const allRefs = repo.getAllForTesting();
      expect(allRefs.length).toBe(0);
    });

    it('should handle deletion of non-existent externalId gracefully', async () => {
      await expect(repo.delete('non-existent-id')).rejects.toBeNull();
    });
  });
});
