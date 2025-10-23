import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { v4 as uuidv4 } from 'uuid';

export type CreateRecipeUsecaseRequest = {
  userId: string;
  name: string;
  ingredientLines: IngredientLine[];
};

export class CreateRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(request: CreateRecipeUsecaseRequest): Promise<RecipeDTO> {
    // NOTE: userId, name and ingredientLines validation is performed in the entity

    const newRecipe = Recipe.create({
      id: uuidv4(),
      userId: request.userId,
      name: request.name,
      ingredientLines: request.ingredientLines,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.recipesRepo.saveRecipe(newRecipe);

    return toRecipeDTO(newRecipe);
  }
}
