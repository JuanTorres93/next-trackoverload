import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError } from '@/domain/common/errors';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { ExternalIngredientsRefRepo } from '@/domain/repos/ExternalIngredientsRefRepo.port';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { UnitOfWork } from '@/application-layer/unit-of-work/UnitOfWork.port';
import { createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo } from '../common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo';

export type AddIngredientToRecipeUsecaseRequest = {
  recipeId: string;
  userId: string;
  externalIngredientId: string;
  source: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  imageUrl?: string;
  quantityInGrams: number;
};

export class AddIngredientToRecipeUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private ingredientsRepo: IngredientsRepo,
    private usersRepo: UsersRepo,
    private externalIngredientsRefRepo: ExternalIngredientsRefRepo,
    private idGenerator: IdGenerator,
    private unitOfWork: UnitOfWork,
  ) {}

  async execute(
    request: AddIngredientToRecipeUsecaseRequest,
  ): Promise<RecipeDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `AddIngredientToRecipeUsecase: user with id ${request.userId} not found`,
      );
    }
    const existingRecipe: Recipe | null =
      await this.recipesRepo.getRecipeByIdAndUserId(
        request.recipeId,
        request.userId,
      );

    if (!existingRecipe) {
      throw new NotFoundError(
        `AddIngredientToRecipeUsecase: Recipe with id ${request.recipeId} not found`,
      );
    }

    const {
      createdIngredients,
      createdExternalIngredients,
      existingIngredients,
      quantitiesMapByExternalId,
    } =
      await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
        [
          {
            externalIngredientId: request.externalIngredientId,
            source: request.source,
            name: request.name,
            caloriesPer100g: request.caloriesPer100g,
            proteinPer100g: request.proteinPer100g,
            imageUrl: request.imageUrl,
            quantityInGrams: request.quantityInGrams,
          },
        ],
        this.ingredientsRepo,
        this.externalIngredientsRefRepo,
        this.idGenerator,
      );

    const ingredientToAdd =
      createdIngredients[request.externalIngredientId] ||
      existingIngredients[0];

    const quantityInGrams =
      quantitiesMapByExternalId[request.externalIngredientId].quantityInGrams;

    const newIngredientLine: IngredientLine = IngredientLine.create({
      id: this.idGenerator.generateId(),
      parentId: request.recipeId,
      parentType: 'recipe',
      ingredient: ingredientToAdd,
      quantityInGrams: quantityInGrams,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    existingRecipe.addIngredientLine(newIngredientLine);

    await this.unitOfWork.inTransaction(async () => {
      if (Object.keys(createdExternalIngredients).length > 0) {
        const externalIngredient = Object.values(createdExternalIngredients)[0];

        await this.externalIngredientsRefRepo.save(externalIngredient);
      }

      if (Object.keys(createdIngredients).length > 0) {
        const ingredient = Object.values(createdIngredients)[0];
        await this.ingredientsRepo.saveIngredient(ingredient);
      }

      await this.recipesRepo.saveRecipe(existingRecipe);
    });

    return toRecipeDTO(existingRecipe);
  }
}
