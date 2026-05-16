export type ImageType = {
  buffer: Buffer;
  metadata: {
    url: string;
    filename: string;
    mimeType: string;
    sizeBytes: number;
  };
};

export interface ImagesRepo {
  // This method is intended to be used from the use case
  generateUrl(filename: string): string;

  save(image: ImageType): Promise<ImageType['metadata']>;

  deleteByUrl(imageUrl: string): Promise<void>;

  getByUrl(imageUrl: string): Promise<ImageType['metadata'] | null>;

  duplicateByUrl(imageUrl: string): Promise<ImageType['metadata']>;
}
