import {
  IngredientFinder,
  IngredientFinderResult,
} from "@/domain/services/IngredientFinder.port";

export type FindIngredientByFuzzyNameUsecaseRequest = {
  name: string;
  page?: number;
};

export class FindIngredientByFuzzyNameUsecase {
  constructor(private readonly ingredientFinder: IngredientFinder) {}

  async execute(
    request: FindIngredientByFuzzyNameUsecaseRequest,
  ): Promise<IngredientFinderResult[] | []> {
    const term = (request.name || "").trim();
    if (!term) return [];

    const results = await this.ingredientFinder.findIngredientsByFuzzyName(
      term,
      request.page,
    );

    return results;
  }
}
