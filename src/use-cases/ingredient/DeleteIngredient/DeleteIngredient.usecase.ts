import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';

export type DeleteIngredientUsecaseRequest = {
  id: string;
};

export class DeleteIngredientUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(request: DeleteIngredientUsecaseRequest): Promise<void> {
    validateNonEmptyString(request.id, 'DeleteIngredientUsecase');

    // Search ingredient
    const ingredient = await this.ingredientsRepo.getIngredientById(request.id);

    if (!ingredient) {
      throw new NotFoundError('DeleteIngredientUsecase: Ingredient not found');
    }

    await this.ingredientsRepo.deleteIngredient(request.id);
  }
}
