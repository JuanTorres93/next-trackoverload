import {
  IngredientDTO,
  toIngredientDTO,
} from '@/application-layer/dtos/IngredientDTO';
import { NotFoundError } from '@/domain/common/errors';
import { IngredientUpdateProps } from '@/domain/entities/ingredient/Ingredient';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';

export type UpdateIngredientUsecaseRequest = {
  id: string;
  patch: IngredientUpdateProps;
};

export class UpdateIngredientUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(
    request: UpdateIngredientUsecaseRequest
  ): Promise<IngredientDTO> {
    const existingIngredient = await this.ingredientsRepo.getIngredientById(
      request.id
    );

    if (!existingIngredient) {
      throw new NotFoundError('Ingredient not found');
    }

    existingIngredient.update(request.patch);

    await this.ingredientsRepo.saveIngredient(existingIngredient);

    return toIngredientDTO(existingIngredient);
  }
}
