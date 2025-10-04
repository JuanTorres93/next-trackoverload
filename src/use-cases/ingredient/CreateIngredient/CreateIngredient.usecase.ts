import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { v4 as uuidv4 } from 'uuid';

export type CreateIngredientUsecaseRequest = {
  name: string;
  calories: number;
  protein: number;
};

export class CreateIngredientUsecase {
  constructor(private ingredientsRepo: IngredientsRepo) {}

  async execute(request: CreateIngredientUsecaseRequest): Promise<Ingredient> {
    // Validation is done in the entity constructor
    const newIngredient = Ingredient.create({
      id: uuidv4(),
      name: request.name,
      nutritionalInfoPer100g: {
        calories: request.calories,
        protein: request.protein,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.ingredientsRepo.saveIngredient(newIngredient);

    return newIngredient;
  }
}
