import {
  IngredientFinder,
  IngredientFinderResult,
} from "../../../../domain/services/IngredientFinder.port";

export class MemoryIngredientFinder implements IngredientFinder {
  constructor(
    private seed: IngredientFinderResult[] = [],
    private pageSize = 1000,
  ) {}

  async findIngredientsByFuzzyName(
    name: string,
    page = 1,
  ): Promise<IngredientFinderResult[] | []> {
    const q = name.trim().toLowerCase();
    if (!q) return [];

    const matches = this.seed.filter((item) =>
      (item.ingredient.name || "").toLowerCase().includes(q),
    );

    const start = (Math.max(1, page) - 1) * this.pageSize;
    return matches.slice(start, start + this.pageSize);
  }

  async findIngredientsByBarcode(
    barcode: string,
  ): Promise<IngredientFinderResult[] | []> {
    const q = barcode.trim();
    if (!q) return [];

    return this.seed.filter((item) => item.externalRef.externalId === q);
  }
}

export default MemoryIngredientFinder;
