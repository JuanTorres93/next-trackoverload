import imageCompression from 'browser-image-compression';

import { ClientImageProcessor } from '@/domain/services/ImageProcessor/ClientImageProcessor.port';
import { MAX_MB } from '@/domain/services/ImageProcessor/Config';

// TODO: Find a way to test it. I couldn't test it because it seems not to work on node environment.
export class BrowserImageCompressionClientImageProcessor implements ClientImageProcessor {
  async compressToMaxMB(
    imageData: File,
    maxMB: number = MAX_MB,
  ): Promise<File> {
    const options = {
      maxSizeMB: maxMB,
      useWebWorker: true,
    };

    const compressedFile = await imageCompression(imageData, options);

    return compressedFile;
  }
}
