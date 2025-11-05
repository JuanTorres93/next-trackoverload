import { ImageManager } from '@/domain/services/ImageUploader.port';
import { validateNonEmptyString } from '@/domain/common/validation';
import { NotFoundError } from '@/domain/common/errors';

export type GetImageByUrlUsecaseRequest = {
  imageUrl: string;
};

export type GetImageByUrlUsecaseResponse = {
  imageBuffer: Buffer;
  mimeType: string;
  filename: string;
  sizeBytes: number;
};

export class GetImageByUrlUsecase {
  constructor(private imageManager: ImageManager) {}

  async execute(
    request: GetImageByUrlUsecaseRequest
  ): Promise<GetImageByUrlUsecaseResponse> {
    validateNonEmptyString(request.imageUrl, 'GetImageByUrl imageUrl');

    // Get the image buffer
    const imageBuffer = await this.imageManager.getImageByUrl(request.imageUrl);

    if (!imageBuffer) {
      throw new NotFoundError(`Image not found: ${request.imageUrl}`);
    }

    // Get image metadata for additional information
    const imageInfo = await this.imageManager.getImageInfo(request.imageUrl);

    return {
      imageBuffer,
      mimeType: imageInfo?.mimeType || 'application/octet-stream',
      filename: imageInfo?.filename || 'unknown',
      sizeBytes: imageInfo?.sizeBytes || imageBuffer.length,
    };
  }
}
