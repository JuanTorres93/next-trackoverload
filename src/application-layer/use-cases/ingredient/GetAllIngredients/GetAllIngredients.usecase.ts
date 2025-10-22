import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';

export class GetAllIngredientsUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(): Promise<Ingredient[]> {
    const ingredients = await this.ingredientsRepo.getAllIngredients();

    return ingredients || [];
  }
}
