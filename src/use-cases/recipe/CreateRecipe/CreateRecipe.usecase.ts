import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientLine } from '@/domain/entities/ingredient/IngredientLine';
import { v4 as uuidv4 } from 'uuid';

export type CreateRecipeUsecaseRequest = {
  name: string;
  ingredientLines: IngredientLine[];
};

export class CreateRecipeUsecase {
  constructor(private recipesRepo: RecipesRepo) {}

  async execute(request: CreateRecipeUsecaseRequest): Promise<Recipe> {
    // NOTE: name and ingredientLines validation is performed in the entity

    const newRecipe = Recipe.create({
      id: uuidv4(),
      name: request.name,
      ingredientLines: request.ingredientLines,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.recipesRepo.saveRecipe(newRecipe);

    return newRecipe;
  }
}
