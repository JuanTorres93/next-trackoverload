import { ExternalIngredientsRefRepo } from '@/domain/repos/ExternalIngredientsRefRepo.port';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';

export class MemoryExternalIngredientsRefRepo implements ExternalIngredientsRefRepo {
  private repoStorage: ExternalIngredientRef[] = [];

  async getAllExternalIngredientsRef(): Promise<ExternalIngredientRef[]> {
    return [...this.repoStorage];
  }

  async getByExternalIdAndSource(
    externalId: string,
    source: string,
  ): Promise<ExternalIngredientRef | null> {
    const found = this.repoStorage.find(
      (r) => r.externalId === externalId && r.source === source,
    );
    return found || null;
  }

  async getByExternalIdsAndSource(
    externalIds: string[],
    source: string,
  ): Promise<ExternalIngredientRef[]> {
    return this.repoStorage.filter(
      (r) => externalIds.includes(r.externalId) && r.source === source,
    );
  }

  async save(externalIngredientRef: ExternalIngredientRef): Promise<void> {
    const existingIndex = this.repoStorage.findIndex(
      (r) =>
        r.externalId === externalIngredientRef.externalId &&
        r.source === externalIngredientRef.source,
    );

    if (existingIndex !== -1) {
      this.repoStorage[existingIndex] = externalIngredientRef;
    } else {
      this.repoStorage.push(externalIngredientRef);
    }
  }

  async delete(externalId: string): Promise<void> {
    const initialLength = this.repoStorage.length;
    this.repoStorage = this.repoStorage.filter(
      (r) => r.externalId !== externalId,
    );

    if (this.repoStorage.length === initialLength) {
      return Promise.reject(null);
    }
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  clearForTesting(): void {
    this.repoStorage = [];
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  countForTesting(): number {
    return this.repoStorage.length;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  getAllForTesting(): ExternalIngredientRef[] {
    return [...this.repoStorage];
  }
}
