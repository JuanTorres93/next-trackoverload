import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import { ExternalIngredientRefDTO } from '@/application-layer/dtos/ExternalIngredientRefDTO';

// Combines both DTOs: ingredient properties (without id and dates) + external ref properties (without ingredientId and dates)
export type IngredientFinderDTO = Omit<
  IngredientDTO,
  'id' | 'createdAt' | 'updatedAt'
> &
  Omit<ExternalIngredientRefDTO, 'ingredientId' | 'createdAt'>;

export interface IngredientFinder {
  findIngredientsByFuzzyName(name: string): Promise<IngredientFinderDTO[] | []>;
  findIngredientsByBarcode(
    barcode: string
  ): Promise<IngredientFinderDTO[] | []>;
}
