import {
  IngredientFinder,
  IngredientFinderResult,
} from "@/domain/services/IngredientFinder.port";

export class MemoryIngredientFinder implements IngredientFinder {
  constructor(private seed: IngredientFinderResult[] = []) {}

  async findIngredientsByFuzzyName(
    name: string,
    _page = 1,
  ): Promise<IngredientFinderResult[] | []> {
    const q = name.trim().toLowerCase();
    if (!q) return [];

    return this.seed.filter((item) =>
      (item.ingredient.name || "").toLowerCase().includes(q),
    );
  }

  async findIngredientsByBarcode(
    barcode: string,
  ): Promise<IngredientFinderResult[] | []> {
    const q = barcode.trim();
    if (!q) return [];

    return this.seed.filter(
      (item) =>
        item.externalRef.externalId === q ||
        item.externalRef.externalId?.includes(q),
    );
  }
}

export default MemoryIngredientFinder;
