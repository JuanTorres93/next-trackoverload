import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import {
  IngredientDTO,
  toIngredientDTO,
} from '@/application-layer/dtos/IngredientDTO';
import { ValidationError } from '@/domain/common/errors';

export type GetIngredientsByFuzzyNameInput = {
  name: string;
};

// TODO make this usecase interact with service instead of repo? Give it a thought
export class GetIngredientsByFuzzyNameUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(
    input: GetIngredientsByFuzzyNameInput
  ): Promise<IngredientDTO[]> {
    if (!input || typeof input.name !== 'string') {
      throw new ValidationError(
        'GetIngredientsByFuzzyName: name is required and must be a string'
      );
    }

    const trimmedName = input.name.trim();

    if (!trimmedName) {
      return [];
    }

    const ingredients = await this.ingredientsRepo.getByFuzzyName(trimmedName);

    return ingredients.map(toIngredientDTO);
  }
}
