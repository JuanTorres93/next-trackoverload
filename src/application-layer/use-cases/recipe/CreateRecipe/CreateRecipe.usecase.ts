import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { ExternalIngredientsRefRepo } from '@/domain/repos/ExternalIngredientsRefRepo.port';
import { ImagesRepo } from '@/domain/repos/ImagesRepo.port';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { ImageProcessor } from '@/domain/services/ImageProcessor/ImageProcessor.port';
import {
  createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo,
  CreateIngredientLineData,
} from '../common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo';
import { processRecipeImageBufferForUploading } from '../common/processImageBufferForUploading';

export type CreateRecipeUsecaseRequest = {
  actorUserId: string;
  targetUserId: string;
  name: string;
  ingredientLinesInfo: CreateIngredientLineData[];
  imageBuffer?: Buffer;
};

export class CreateRecipeUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private ingredientsRepo: IngredientsRepo,
    private imagesRepo: ImagesRepo,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
    private externalIngredientsRefRepo: ExternalIngredientsRefRepo,
    private imageProcessor: ImageProcessor,
  ) {}

  async execute(request: CreateRecipeUsecaseRequest): Promise<RecipeDTO> {
    if (request.actorUserId !== request.targetUserId) {
      throw new PermissionError(
        'CreateRecipeUsecase: cannot create recipe for another user',
      );
    }

    const user = await this.usersRepo.getUserById(request.targetUserId);
    if (!user) {
      throw new NotFoundError(
        `CreateRecipeUsecase: user with id ${request.targetUserId} not found`,
      );
    }

    const {
      createdIngredients: missingIngredients,
      createdExternalIngredients: missingExternalIngredients,
      allIngredients: allIngredientsInRecipe,
      quantitiesMapByExternalId,
    } = await createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo(
      request.ingredientLinesInfo,
      this.ingredientsRepo,
      this.externalIngredientsRefRepo,
      this.idGenerator,
    );

    const ingredientLines: IngredientLine[] = [];
    const newRecipeId = this.idGenerator.generateId();

    // Create IngredientLine entities
    for (const ingredient of allIngredientsInRecipe) {
      // Find the corresponding quantityInGrams from the request using externalIngredientId and ingredientId
      const quantityInGrams =
        quantitiesMapByExternalId[
          Object.keys(quantitiesMapByExternalId).find(
            (extId) =>
              quantitiesMapByExternalId[extId].ingredientId === ingredient.id,
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
      const imageType = await processRecipeImageBufferForUploading(
        request.imageBuffer,
        this.imageProcessor,
        this.imagesRepo,
        newRecipeId,
      );

      imageMetadata = await this.imagesRepo.save(imageType);
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
