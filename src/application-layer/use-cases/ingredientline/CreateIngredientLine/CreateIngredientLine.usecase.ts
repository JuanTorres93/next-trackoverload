import { IngredientLinesRepo } from '@/domain/repos/IngredientLinesRepo.port';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { Id } from '@/domain/types/Id/Id';
import {
  IngredientLineDTO,
  toIngredientLineDTO,
} from '@/application-layer/dtos/IngredientLineDTO';
import { NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';

export type CreateIngredientLineUsecaseRequest = {
  ingredientId: string;
  quantityInGrams: number;
};

export class CreateIngredientLineUsecase {
  constructor(
    private ingredientLinesRepo: IngredientLinesRepo,
    private ingredientsRepo: IngredientsRepo
  ) {}

  async execute(
    request: CreateIngredientLineUsecaseRequest
  ): Promise<IngredientLineDTO> {
    // Get the ingredient
    const ingredient = await this.ingredientsRepo.getIngredientById(
      request.ingredientId
    );

    if (!ingredient) {
      throw new NotFoundError(
        `CreateIngredientLineUsecase: Ingredient with id ${request.ingredientId} not found`
      );
    }

    // Validation is done in the entity constructor
    const newIngredientLine = IngredientLine.create({
      id: Id.create(uuidv4()),
      ingredient,
      quantityInGrams: request.quantityInGrams,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.ingredientLinesRepo.saveIngredientLine(newIngredientLine);

    return toIngredientLineDTO(newIngredientLine);
  }
}
