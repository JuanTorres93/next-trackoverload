import { logNoTest } from "@/domain/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import {
  ImageType,
  ImagesRepo,
} from "../../../../domain/repos/ImagesRepo.port";
import { RecipesRepo } from "../../../../domain/repos/RecipesRepo.port";
import { ImageProcessor } from "../../../../domain/services/ImageProcessor/ServerImageProcessor.port";
import { RecipeDTO, toRecipeDTO } from "../../../dtos/RecipeDTO";
import { processRecipeImageBufferForUploading } from "../common/processImageBufferForUploading";

export type UpdateRecipeImageUsecaseRequest = {
  recipeId: string;
  userId: string;
  imageData: Buffer;
};

export class UpdateRecipeImageUsecase {
  constructor(
    private recipesRepo: RecipesRepo,
    private imagesRepo: ImagesRepo,
    private imageProcessor: ImageProcessor,
  ) {}

  async execute(
    request: UpdateRecipeImageUsecaseRequest,
  ): Promise<RecipeDTO | null> {
    const recipe = await this.recipesRepo.getRecipeByIdAndUserId(
      request.recipeId,
      request.userId,
    );

    if (!recipe) {
      logNoTest(
        `UpdateRecipeImageUsecase: Recipe with id ${request.recipeId} not found`,
      );

      throw new NotFoundError("La receta no existe.");
    }

    // Get image
    const currentImageUrl = recipe.imageUrl;

    let oldImage = undefined;

    if (currentImageUrl) {
      oldImage = await this.imagesRepo.getByUrl(currentImageUrl);
    }

    // Delete old image if exists
    if (oldImage) {
      await this.imagesRepo.deleteByUrl(currentImageUrl!);
    }

    // Upload new image
    const imageType: ImageType = await processRecipeImageBufferForUploading(
      request.imageData,
      this.imageProcessor,
      this.imagesRepo,
      recipe.id,
    );

    const newImageMetadata = await this.imagesRepo.save(imageType);

    // Update recipe with new image URL
    recipe.updateImageUrl(newImageMetadata.url);

    // Save recipe
    await this.recipesRepo.saveRecipe(recipe);

    return toRecipeDTO(recipe);
  }
}
