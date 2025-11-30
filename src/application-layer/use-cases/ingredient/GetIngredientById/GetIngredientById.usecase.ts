import {
  IngredientDTO,
  toIngredientDTO,
} from '@/application-layer/dtos/IngredientDTO';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';

export type GetIngredientByIdUsecaseRequest = {
  id: string;
};

export class GetIngredientByIdUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(
    request: GetIngredientByIdUsecaseRequest
  ): Promise<IngredientDTO | null> {
    const ingredient = await this.ingredientsRepo.getIngredientById(request.id);

    return ingredient ? toIngredientDTO(ingredient) : null;
  }
}
