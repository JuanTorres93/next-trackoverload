import { ExternalIngredientRefDTO } from "@/application-layer/dtos/ExternalIngredientRefDTO";
import { IngredientDTO } from "@/application-layer/dtos/IngredientDTO";

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
