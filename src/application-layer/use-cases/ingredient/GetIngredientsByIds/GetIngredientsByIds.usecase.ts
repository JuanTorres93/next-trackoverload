import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import {
  IngredientDTO,
  toIngredientDTO,
} from '@/application-layer/dtos/IngredientDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetIngredientsByIdsUsecaseRequest = {
  ids: string[];
};

export class GetIngredientsByIdsUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(
    request: GetIngredientsByIdsUsecaseRequest
  ): Promise<IngredientDTO[]> {
    const ingredientDTOs: IngredientDTO[] = [];

    // First, validate all IDs
    for (const id of request.ids) {
      validateNonEmptyString(id, 'GetIngredientsByIdsUsecase');
    }

    // Then, fetch ingredients to avoid partial results if validation fails
    for (const id of request.ids) {
      const ingredient = await this.ingredientsRepo.getIngredientById(id);
      if (ingredient) {
        ingredientDTOs.push(toIngredientDTO(ingredient));
      }
    }

    return ingredientDTOs || [];
  }
}
