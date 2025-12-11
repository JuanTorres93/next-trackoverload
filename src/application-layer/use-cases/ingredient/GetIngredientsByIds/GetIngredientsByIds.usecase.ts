import {
  IngredientDTO,
  toIngredientDTO,
} from '@/application-layer/dtos/IngredientDTO';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';

export type GetIngredientsByIdsUsecaseRequest = {
  ids: string[];
};

export class GetIngredientsByIdsUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(
    request: GetIngredientsByIdsUsecaseRequest
  ): Promise<IngredientDTO[]> {
    const ingredientDTOs: IngredientDTO[] = [];

    for (const id of request.ids) {
      const ingredient = await this.ingredientsRepo.getIngredientById(id);
      if (ingredient) {
        ingredientDTOs.push(toIngredientDTO(ingredient));
      }
    }

    return ingredientDTOs || [];
  }
}
