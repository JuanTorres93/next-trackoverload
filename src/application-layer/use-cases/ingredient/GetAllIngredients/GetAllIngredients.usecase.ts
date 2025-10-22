import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import {
  IngredientDTO,
  toIngredientDTO,
} from '@/application-layer/dtos/IngredientDTO';

export class GetAllIngredientsUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(): Promise<IngredientDTO[]> {
    const ingredients = await this.ingredientsRepo.getAllIngredients();

    return ingredients.map(toIngredientDTO) || [];
  }
}
