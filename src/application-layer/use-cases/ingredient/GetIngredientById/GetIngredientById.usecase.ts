import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import {
  IngredientDTO,
  toIngredientDTO,
} from '@/application-layer/dtos/IngredientDTO';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetIngredientByIdUsecaseRequest = {
  id: string;
};

export class GetIngredientByIdUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(
    request: GetIngredientByIdUsecaseRequest
  ): Promise<IngredientDTO | null> {
    validateNonEmptyString(request.id, 'GetIngredientByIdUsecase');

    const ingredient = await this.ingredientsRepo.getIngredientById(request.id);
    return ingredient ? toIngredientDTO(ingredient) : null;
  }
}
