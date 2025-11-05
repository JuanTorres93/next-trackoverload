import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

    const imagePath = path.join(process.cwd(), 'data', 'images', filename);

    // Check if file exists
    try {
      await fs.access(imagePath);
    } catch {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Read the file
    const imageBuffer = await fs.readFile(imagePath);

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';

    switch (ext) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }

    // Return the image
    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
