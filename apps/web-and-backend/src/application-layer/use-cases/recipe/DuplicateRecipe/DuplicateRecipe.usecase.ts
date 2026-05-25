import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { IngredientLine } from "../../../../domain/entities/ingredientline/IngredientLine";
import { Recipe } from "../../../../domain/entities/recipe/Recipe";
import { ImagesRepo } from "../../../../domain/repos/ImagesRepo.port";
import { RecipesRepo } from "../../../../domain/repos/RecipesRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import { IdGenerator } from "../../../../domain/services/IdGenerator.port";
import { RecipeDTO, toRecipeDTO } from "../../../dtos/RecipeDTO";

export type DuplicateRecipeUsecaseRequest = {
  recipeId: string;
  userId: string;
  newName?: string;
};

export class DuplicateRecipeUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
    private imagesRepo: ImagesRepo,
  ) {}

  async execute(request: DuplicateRecipeUsecaseRequest): Promise<RecipeDTO> {
    const [user, originalRecipe] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.recipesRepo.getRecipeByIdAndUserId(request.recipeId, request.userId),
    ]);

    if (!user) {
      logNoTest(
        `DuplicateRecipeUsecase: user with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!originalRecipe) {
      logNoTest(
        `DuplicateRecipeUsecase: Recipe with id ${request.recipeId} not found`,
      );

      throw new NotFoundError("La receta no existe.");
    }

    const newRecipeId = this.idGenerator.generateId();
    const newName = request.newName || `${originalRecipe.name} (Copy)`;

    const duplicatedIngredientLines: IngredientLine[] = [];

    // Duplicate ingredient lines to their own instances
    for (const ingredientline of originalRecipe.ingredientLines) {
      const newIngredientLine = IngredientLine.create({
        id: this.idGenerator.generateId(),
        parentId: newRecipeId,
        parentType: "recipe",
        quantityInGrams: ingredientline.quantityInGrams,
        ingredient: ingredientline.ingredient,
      });
      duplicatedIngredientLines.push(newIngredientLine);
    }

    const duplicatedRecipe = Recipe.create({
      id: newRecipeId,
      userId: request.userId,
      name: newName,
      ingredientLines: duplicatedIngredientLines,
    });

    if (originalRecipe.imageUrl) {
      const duplicatedImageMetadata = await this.imagesRepo.duplicateByUrl(
        originalRecipe.imageUrl,
      );

      duplicatedRecipe.updateImageUrl(duplicatedImageMetadata.url);
    }

    await this.recipesRepo.saveRecipe(duplicatedRecipe);

    return toRecipeDTO(duplicatedRecipe);
  }
}
