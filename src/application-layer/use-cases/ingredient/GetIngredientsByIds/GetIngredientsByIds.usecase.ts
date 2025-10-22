import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetIngredientsByIdsUsecaseRequest = {
  ids: string[];
};

export class GetIngredientsByIdsUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(
    request: GetIngredientsByIdsUsecaseRequest
  ): Promise<Ingredient[]> {
    const ingredients: Ingredient[] = [];

    // First, validate all IDs
    for (const id of request.ids) {
      validateNonEmptyString(id, 'GetIngredientsByIdsUsecase');
    }

    // Then, fetch ingredients to avoid partial results if validation fails
    for (const id of request.ids) {
      const ingredient = await this.ingredientsRepo.getIngredientById(id);
      if (ingredient) {
        ingredients.push(ingredient);
      }
    }

    return ingredients || [];
  }
}
