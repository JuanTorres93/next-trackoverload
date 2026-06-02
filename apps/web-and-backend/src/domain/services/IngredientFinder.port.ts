import { ExternalIngredientRefDTO, IngredientDTO } from "shared";

export type IngredientFinderResult = {
  ingredient: Omit<IngredientDTO, "id" | "createdAt" | "updatedAt">;
  externalRef: Omit<ExternalIngredientRefDTO, "ingredientId" | "createdAt">;
};

export interface IngredientFinder {
  findIngredientsByFuzzyName(
    name: string,
    page?: number,
  ): Promise<IngredientFinderResult[] | []>;
  findIngredientsByBarcode(
    barcode: string,
  ): Promise<IngredientFinderResult[] | []>;
}
