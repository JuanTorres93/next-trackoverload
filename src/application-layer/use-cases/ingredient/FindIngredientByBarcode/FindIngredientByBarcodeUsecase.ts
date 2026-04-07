import {
  IngredientFinder,
  IngredientFinderResult,
} from "@/domain/services/IngredientFinder.port";

export type FindIngredientByBarcodeUsecaseRequest = {
  barcode: string;
};

export class FindIngredientByBarcodeUsecase {
  constructor(private readonly ingredientFinder: IngredientFinder) {}

  async execute(
    request: FindIngredientByBarcodeUsecaseRequest,
  ): Promise<IngredientFinderResult[] | []> {
    const code = (request.barcode || "").trim();
    if (!code) return [];

    return this.ingredientFinder.findIngredientsByBarcode(code);
  }
}
