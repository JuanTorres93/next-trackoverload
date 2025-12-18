import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { ImageManager } from '@/domain/services/ImageManager.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

export type IngredientLineInfo = {
  ingredientId: string;
  quantityInGrams: number;
};

export type CreateRecipeUsecaseRequest = {
  userId: string;
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
    private idGenerator: IdGenerator
  ) {}

  async execute(request: CreateRecipeUsecaseRequest): Promise<RecipeDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `CreateRecipeUsecase: user with id ${request.userId} not found`
      );
    }

    const ingredientLines: IngredientLine[] = [];
    const newRecipeId = this.idGenerator.generateId();

    // Fetch all ingredients by their IDs
    const ingredientIds = request.ingredientLinesInfo.map(
      (info) => info.ingredientId
    );
    const fetchedIngredients = await this.ingredientsRepo.getIngredientsByIds(
      ingredientIds
    );

    // If any ingredient is missing, throw an error
    if (fetchedIngredients.length !== ingredientIds.length) {
      const missingIds = ingredientIds.filter(
        (id) => !fetchedIngredients.some((ing) => ing.id === id)
      );

      throw new ValidationError(
        `CreateRecipeUseCase: Ingredients with IDs ${missingIds.join(
          ', '
        )} not found while creating recipe`
      );
    }

    // Create IngredientLine entities
    for (const ingredient of fetchedIngredients) {
      // Find the corresponding quantityInGrams from the request
      const quantityInGrams = request.ingredientLinesInfo.find(
        (lineInfo) => lineInfo.ingredientId === ingredient.id
      )!.quantityInGrams;

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
      userId: request.userId,
      name: request.name,
      ingredientLines: ingredientLines,
      imageUrl: imageMetadata ? imageMetadata.url : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.recipesRepo.saveRecipe(newRecipe);

    return toRecipeDTO(newRecipe);
  }
}
