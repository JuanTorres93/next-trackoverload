export interface ClientImageProcessor {
  compressToMaxMB(imageData: File, maxMB: number): Promise<File>;
}
