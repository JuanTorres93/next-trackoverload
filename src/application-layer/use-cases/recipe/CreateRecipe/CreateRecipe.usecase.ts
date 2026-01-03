import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { ExternalIngredientsRefRepo } from '@/domain/repos/ExternalIngredientsRefRepo.port';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { ImageManager } from '@/domain/services/ImageManager.port';

export type IngredientLineInfo = {
  externalIngredientId: string;
  source: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  imageUrl?: string;
  quantityInGrams: number;
};

export type CreateRecipeUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
  name: string;
  ingredientLinesInfo: IngredientLineInfo[];
  imageBuffer?: Buffer;
};

export class CreateRecipeUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private ingredientsRepo: IngredientsRepo,
    private imageManager: ImageManager,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
    private externalIngredientsRefRepo: ExternalIngredientsRefRepo
  ) {}

  async execute(request: CreateRecipeUsecaseRequest): Promise<RecipeDTO> {
    if (request.actorUserId !== request.targetUserId) {
      throw new PermissionError(
        'CreateRecipeUsecase: cannot create recipe for another user'
      );
    }

    const user = await this.usersRepo.getUserById(request.targetUserId);
    if (!user) {
      throw new NotFoundError(
        `CreateRecipeUsecase: user with id ${request.targetUserId} not found`
      );
    }

    // Check if external ingredients exists in repos
    const externalIngredientIds = request.ingredientLinesInfo.map(
      (info) => info.externalIngredientId
    );

    const fetchedExternalIngredients: ExternalIngredientRef[] =
      await this.externalIngredientsRefRepo.getByExternalIdsAndSource(
        externalIngredientIds,
        request.ingredientLinesInfo[0].source
      );

    // Get existing ingredients
    const existingIngredients = await this.ingredientsRepo.getIngredientsByIds(
      fetchedExternalIngredients.map((ref) => ref.ingredientId)
    );

    // If any ingredient is missing, create it along with its ExternalIngredientRef
    const missingExternalIngredients: Record<string, ExternalIngredientRef> =
      {};
    const missingIngredients: Record<string, Ingredient> = {};

    if (externalIngredientIds.length !== fetchedExternalIngredients.length) {
      for (const lineInfo of request.ingredientLinesInfo) {
        const exists = fetchedExternalIngredients.find(
          (ing) =>
            ing.externalId === lineInfo.externalIngredientId &&
            ing.source === lineInfo.source
        );

        if (exists) continue;

        // Create new ExternalIngredientRef
        const newIngredientId = this.idGenerator.generateId();

        missingExternalIngredients[lineInfo.externalIngredientId] =
          ExternalIngredientRef.create({
            externalId: lineInfo.externalIngredientId,
            source: lineInfo.source,
            ingredientId: newIngredientId,
            createdAt: new Date(),
          });

        // Create new Ingredient
        missingIngredients[lineInfo.externalIngredientId] = Ingredient.create({
          id: newIngredientId,
          name: lineInfo.name,
          calories: lineInfo.caloriesPer100g,
          protein: lineInfo.proteinPer100g,
          imageUrl: lineInfo.imageUrl,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Get quantities for each ingredient line
    const quantitiesMapByExternalId: Record<
      string,
      { ingredientId: string; quantityInGrams: number }
    > = {};

    // Existing ingredients
    for (const existingExternalIngredient of fetchedExternalIngredients) {
      const lineInfo = request.ingredientLinesInfo.find(
        (info) =>
          info.externalIngredientId === existingExternalIngredient.externalId
      );

      quantitiesMapByExternalId[existingExternalIngredient.externalId] = {
        ingredientId: existingExternalIngredient.ingredientId,
        quantityInGrams: lineInfo!.quantityInGrams,
      };
    }

    // Just created ingredients
    for (const missingExtIngredientId of Object.keys(
      missingExternalIngredients
    )) {
      const lineInfo = request.ingredientLinesInfo.find(
        (info) => info.externalIngredientId === missingExtIngredientId
      );

      quantitiesMapByExternalId[missingExtIngredientId] = {
        ingredientId:
          missingExternalIngredients[missingExtIngredientId].ingredientId,
        quantityInGrams: lineInfo!.quantityInGrams,
      };
    }

    const allIngredientsInRecipe = [
      ...existingIngredients,
      ...Object.values(missingIngredients),
    ];

    const ingredientLines: IngredientLine[] = [];
    const newRecipeId = this.idGenerator.generateId();

    // Create IngredientLine entities
    for (const ingredient of allIngredientsInRecipe) {
      // Find the corresponding quantityInGrams from the request using externalIngredientId and ingredientId
      const quantityInGrams =
        quantitiesMapByExternalId[
          Object.keys(quantitiesMapByExternalId).find(
            (extId) =>
              quantitiesMapByExternalId[extId].ingredientId === ingredient.id
          )!
        ].quantityInGrams;

      const ingredientLine = IngredientLine.create({
        id: this.idGenerator.generateId(),
        parentId: newRecipeId,
        parentType: 'recipe',
        ingredient: ingredient,
        quantityInGrams: quantityInGrams,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      ingredientLines.push(ingredientLine);
    }

    // Upload image if provided
    let imageMetadata;
    if (request.imageBuffer) {
      imageMetadata = await this.imageManager.uploadImage(
        request.imageBuffer,
        `recipe-${this.idGenerator.generateId()}-${Date.now()}.png`,
        {
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          quality: 0.8,
        }
      );
    }

    const newRecipe = Recipe.create({
      id: newRecipeId,
      userId: request.targetUserId,
      name: request.name,
      ingredientLines: ingredientLines,
      imageUrl: imageMetadata ? imageMetadata.url : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save any missing ingredients and external refs
    // TODO IMPORTANT: Create methods for batch saving to optimize performance
    for (const extRef of Object.values(missingExternalIngredients)) {
      await this.externalIngredientsRefRepo.save(extRef);
    }
    for (const ingredient of Object.values(missingIngredients)) {
      await this.ingredientsRepo.saveIngredient(ingredient);
    }
    await this.recipesRepo.saveRecipe(newRecipe);

    return toRecipeDTO(newRecipe);
  }
}
