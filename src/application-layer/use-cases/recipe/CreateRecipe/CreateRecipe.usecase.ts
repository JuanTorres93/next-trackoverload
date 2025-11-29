import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { ValidationError } from '@/domain/common/errors';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { ImageManager } from '@/domain/services/ImageManager.port';
import { v4 as uuidv4 } from 'uuid';

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
    private imageManager: ImageManager
  ) {}

  async execute(request: CreateRecipeUsecaseRequest): Promise<RecipeDTO> {
    const ingredientLines: IngredientLine[] = [];
    const newRecipeId = uuidv4();

    for (const info of request.ingredientLinesInfo) {
      // TODO: Improve the fetching strategy
      const ingredient = await this.ingredientsRepo.getIngredientById(
        info.ingredientId
      );

      if (!ingredient) {
        throw new ValidationError(
          `CreateRecipeUseCase: Ingredient with ID ${info.ingredientId} not found while creating recipe`
        );
      }

      const ingredientLine = IngredientLine.create({
        id: uuidv4(),
        parentId: newRecipeId,
        parentType: 'recipe',
        ingredient: ingredient,
        quantityInGrams: info.quantityInGrams,
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
        `recipe-${uuidv4()}-${Date.now()}.png`,
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
