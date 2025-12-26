import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';

export interface IngredientFinder {
  findIngredientsByFuzzyName(name: string): Promise<IngredientDTO[] | []>;
  findIngredientsByBarcode(barcode: string): Promise<IngredientDTO[] | []>;
}
