import { NextRequest, NextResponse } from 'next/server';
import { AppGetImageByUrlUsecase } from '@/interface-adapters/app/use-cases/imagemanager/GetImageByUrl/getImageByUrl';
import { NotFoundError } from '@/domain/common/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Validate filename to prevent directory traversal
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    // Construct the full image URL that the ImageManager expects
    const imageUrl = `/api/images/${filename}`;

    // Use the GetImageByUrl use case
    const result = await AppGetImageByUrlUsecase.execute({ imageUrl });

    // Return the image
    return new NextResponse(new Uint8Array(result.imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': result.mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);

    if (error instanceof NotFoundError) {
      return new NextResponse('Image not found', { status: 404 });
    }

    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
