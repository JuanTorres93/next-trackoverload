import { ImageType } from '@/domain/repos/ImagesRepo.port';
import { ImageProcessor } from '@/domain/services/ImageProcessor.port';
import {
  MAX_MB,
  SQUARE_IMAGE_SIZE_PIXELS,
} from '@/infra/services/ImageProcessor/common';

export async function processRecipeImageBufferForUploading(
  imageBuffer: Buffer,
  imageProcessor: ImageProcessor,
  recipeId: string
): Promise<ImageType> {
  const resizedImageBuffer = await imageProcessor.resizeToSquare(
    imageBuffer,
    SQUARE_IMAGE_SIZE_PIXELS
  );
  const processedImageBuffer = await imageProcessor.compressToMaxMB(
    resizedImageBuffer,
    MAX_MB
  );

  const metadata: ImageType['metadata'] = {
    url: '', // to be filled by ImagesRepo
    filename: `recipe_${recipeId}.jpg`,
    mimeType: 'image/jpeg',
    sizeBytes: processedImageBuffer.length,
  };

  return {
    buffer: processedImageBuffer,
    metadata,
  };
}
