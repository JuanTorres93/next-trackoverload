import { RecipeDTO, toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError } from '@/domain/common/errors';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { ImagesRepo, ImageType } from '@/domain/repos/ImagesRepo.port';

export type UpdateRecipeImageUsecaseRequest = {
  recipeId: string;
  userId: string;
  imageData: Buffer;
};

export class UpdateRecipeImageUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private imagesRepo: ImagesRepo
  ) {}

  async execute(
    request: UpdateRecipeImageUsecaseRequest
  ): Promise<RecipeDTO | null> {
    const recipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.recipeId,
      request.userId
    );

    if (!recipe) {
      throw new NotFoundError(
        `UpdateRecipeImageUsecase: Recipe with id ${request.recipeId} not found`
      );
    }

    // Get image
    const currentImageUrl = recipe.imageUrl;

    const oldImage = await this.imagesRepo.getByUrl(currentImageUrl!);

    const imageFileName = oldImage
      ? oldImage.filename
      : `recipe-${recipe.id}-image.png`;

    // Delete old image if exists
    if (oldImage) {
      await this.imagesRepo.deleteByUrl(currentImageUrl!);
    }

    // Upload new image
    const metadata: ImageType['metadata'] = {
      url: '', // Will be set by repo
      filename: imageFileName,
      mimeType: 'image/png',
      sizeBytes: request.imageData.length,
    };

    const newImageMetadata = await this.imagesRepo.save({
      buffer: request.imageData,
      metadata,
    });

    // Update recipe with new image URL
    recipe.updateImageUrl(newImageMetadata.url);

    // Save recipe
    await this.recipesRepo.saveRecipe(recipe);

    return toRecipeDTO(recipe);
  }
}
