import { ExternalIngredientRef } from '../entities/externalingredientref/ExternalIngredientRef';

export interface ExternalIngredientsRefRepo {
  getAllExternalIngredientsRef(): Promise<ExternalIngredientRef[]>;
  getByExternalIdAndSource(
    externalId: string,
    source: string,
  ): Promise<ExternalIngredientRef | null>;
  getByExternalIdsAndSource(
    externalIds: string[],
    source: string,
  ): Promise<ExternalIngredientRef[]>;
  save(externalIngredientRef: ExternalIngredientRef): Promise<void>;
  delete(externalId: string): Promise<void>;
}
