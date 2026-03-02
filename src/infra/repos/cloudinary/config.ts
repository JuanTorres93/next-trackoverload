import { InfrastructureError } from '@/domain/common/errors';
import { v2 as cloudinary } from 'cloudinary';

let configured = false;

export function getCloudinaryInstance(): typeof cloudinary {
  if (configured) {
    return cloudinary;
  }

  let CLOUDINARY_CLOUD_NAME: string | undefined;
  let CLOUDINARY_API_KEY: string | undefined;
  let CLOUDINARY_API_SECRET: string | undefined;

  if (process.env.NODE_ENV === 'production') {
    CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME_PROD;
    CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY_PROD;
    CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET_PROD;
  } else {
    CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME_DEV;
    CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY_DEV;
    CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET_DEV;
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new InfrastructureError(
      'getCloudinaryInstance: Cloudinary env vars not set',
    );
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  configured = true;
  return cloudinary;
}
