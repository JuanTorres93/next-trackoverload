import { InfrastructureError } from '@/domain/common/errors';
import { v2 as cloudinary } from 'cloudinary';

let configured = false;

export function getCloudinaryInstance(): typeof cloudinary {
  if (configured) {
    return cloudinary;
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new InfrastructureError(
      'getCloudinaryInstance: Cloudinary env vars not set',
    );
  }

  // TODO IMPORTANT: create dev account in cloudinary
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  configured = true;
  return cloudinary;
}
