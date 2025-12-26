import { ExternalIngredientRef } from '../entities/externalingredientref/ExternalIngredientRef';

export interface ExternalIngredientsRefRepo {
  getByExternalIdAndSource(
    externalId: string,
    source: string
  ): Promise<ExternalIngredientRef | null>;
  save(externalIngredientRef: ExternalIngredientRef): Promise<void>;
  delete(externalId: string): Promise<void>;
}
