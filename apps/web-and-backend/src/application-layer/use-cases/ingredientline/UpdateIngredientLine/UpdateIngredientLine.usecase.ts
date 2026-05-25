import { logNoTest } from "@/domain/utils/logNoTest";

import { AuthError, NotFoundError } from "../../../../domain/common/errors";
import { Ingredient } from "../../../../domain/entities/ingredient/Ingredient";
import { IngredientLineCreateProps } from "../../../../domain/entities/ingredientline/IngredientLine";
import { Meal } from "../../../../domain/entities/meal/Meal";
import { Recipe } from "../../../../domain/entities/recipe/Recipe";
import { IngredientsRepo } from "../../../../domain/repos/IngredientsRepo.port";
import { MealsRepo } from "../../../../domain/repos/MealsRepo.port";
import { RecipesRepo } from "../../../../domain/repos/RecipesRepo.port";
import { UsersRepo } from "../../../../domain/repos/UsersRepo.port";
import {
  IngredientLineDTO,
  toIngredientLineDTO,
} from "../../../dtos/IngredientLineDTO";

export type UpdateIngredientLineUsecaseRequest = {
  userId: string;
  parentEntityType: IngredientLineCreateProps["parentType"];
  parentEntityId: string;
  ingredientLineId: string;
  ingredientId?: string;
  quantityInGrams?: number;
};

export class UpdateIngredientLineUsecase {
  constructor(
    private ingredientsRepo: IngredientsRepo,
    private recipesRepo: RecipesRepo,
    private mealsRepo: MealsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(
    request: UpdateIngredientLineUsecaseRequest,
  ): Promise<IngredientLineDTO> {
    const [user, parentEntity] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      request.parentEntityType === "recipe"
        ? this.recipesRepo.getRecipeById(request.parentEntityId)
        : this.mealsRepo.getMealById(request.parentEntityId),
    ]);

    if (!user) {
      logNoTest(
        `UpdateIngredientLineUsecase: User with id ${request.userId} not found`,
      );

      throw new NotFoundError("El usuario no existe.");
    }

    if (!parentEntity) {
      logNoTest(
        `UpdateIngredientLineUsecase: ${request.parentEntityType} with id ${request.parentEntityId} not found`,
      );

      throw new NotFoundError(
        request.parentEntityType === "recipe"
          ? "La receta no existe."
          : "La comida no existe.",
      );
    }

    // Validate user owns parent entity
    if (parentEntity.userId !== request.userId) {
      logNoTest(
        `UpdateIngredientLineUsecase: ${request.parentEntityType} with id ${request.parentEntityId} not found for user ${request.userId}`,
      );

      throw new AuthError(
        request.parentEntityType === "recipe"
          ? "No tienes permiso para editar esta receta."
          : "No tienes permiso para editar esta comida.",
      );
    }

    // Verify the ingredient line exists in the parent entity
    const existingIngredientLine = parentEntity!.ingredientLines.find(
      (line) => line.id === request.ingredientLineId,
    );

    if (!existingIngredientLine) {
      logNoTest(
        `UpdateIngredientLineUsecase: IngredientLine with id ${request.ingredientLineId} does not belong to the specified ${request.parentEntityType}`,
      );

      throw new NotFoundError(
        request.parentEntityType === "recipe"
          ? "La línea de ingrediente no pertenece a esta receta."
          : "La línea de ingrediente no pertenece a esta comida.",
      );
    }

    // Get the new ingredient if ingredientId is provided
    let newIngredient: Ingredient | undefined;
    if (request.ingredientId !== undefined) {
      const foundIngredient = await this.ingredientsRepo.getIngredientById(
        request.ingredientId,
      );

      if (!foundIngredient) {
        logNoTest(
          `UpdateIngredientLineUsecase: Ingredient with id ${request.ingredientId} not found`,
        );

        throw new NotFoundError("El ingrediente no existe.");
      }

      newIngredient = foundIngredient;
    }

    // Create the updated ingredient line
    existingIngredientLine.update({
      ingredient: newIngredient,
      quantityInGrams: request.quantityInGrams,
    });

    // Save the updated parent entity
    if (request.parentEntityType === "recipe") {
      await this.recipesRepo.saveRecipe(parentEntity as Recipe);
    } else if (request.parentEntityType === "meal") {
      await this.mealsRepo.saveMeal(parentEntity as Meal);
    }

    return toIngredientLineDTO(existingIngredientLine);
  }
}
