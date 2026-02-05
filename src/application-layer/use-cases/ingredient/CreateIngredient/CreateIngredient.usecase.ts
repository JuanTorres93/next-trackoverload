import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import {
  IngredientDTO,
  toIngredientDTO,
} from '@/application-layer/dtos/IngredientDTO';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

export type CreateIngredientUsecaseRequest = {
  name: string;
  calories: number;
  protein: number;
};

export class CreateIngredientUsecase {
  constructor(
    private ingredientsRepo: IngredientsRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(
    request: CreateIngredientUsecaseRequest,
  ): Promise<IngredientDTO> {
    const newIngredient = Ingredient.create({
      id: this.idGenerator.generateId(),
      name: request.name,
      calories: Number(request.calories),
      protein: Number(request.protein),
    });

    await this.ingredientsRepo.saveIngredient(newIngredient);

    return toIngredientDTO(newIngredient);
  }
}
