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
  save(image: ImageType): Promise<ImageType['metadata']>;

  deleteByUrl(imageUrl: string): Promise<void>;

  getByUrl(imageUrl: string): Promise<ImageType['metadata'] | null>;
}
