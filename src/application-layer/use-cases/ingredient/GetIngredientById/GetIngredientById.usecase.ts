import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { validateNonEmptyString } from '@/domain/common/validation';

export type GetIngredientByIdUsecaseRequest = {
  id: string;
};

export class GetIngredientByIdUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(
    request: GetIngredientByIdUsecaseRequest
  ): Promise<Ingredient | null> {
    validateNonEmptyString(request.id, 'GetIngredientByIdUsecase');

    const ingredient = await this.ingredientsRepo.getIngredientById(request.id);
    return ingredient || null;
  }
}
