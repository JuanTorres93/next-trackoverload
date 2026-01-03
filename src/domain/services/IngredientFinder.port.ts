import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import { ExternalIngredientRefDTO } from '@/application-layer/dtos/ExternalIngredientRefDTO';

export type IngredientFinderResult = {
  ingredient: Omit<IngredientDTO, 'id' | 'createdAt' | 'updatedAt'>;
  externalRef: Omit<ExternalIngredientRefDTO, 'ingredientId' | 'createdAt'>;
};

export interface IngredientFinder {
  findIngredientsByFuzzyName(
    name: string
  ): Promise<IngredientFinderResult[] | []>;
  findIngredientsByBarcode(
    barcode: string
  ): Promise<IngredientFinderResult[] | []>;
}
