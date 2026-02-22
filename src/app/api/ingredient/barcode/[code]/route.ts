import type { NextRequest } from 'next/server';
import { AppIngredientFinder } from '@/interface-adapters/app/services/AppIngredientFinder';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params;

    if (!code) {
      return Response.json({ error: 'Missing barcode' }, { status: 400 });
    }

    const foundIngredients: IngredientFinderResult[] =
      await AppIngredientFinder.findIngredientsByBarcode(code);

    return Response.json(foundIngredients, { status: 200 });
  } catch (error) {
    console.log(
      'app/api/ingredient/barcode/[code]/GET: Error fetching ingredients:',
      error,
    );
    return Response.json(
      { error: 'Failed to fetch ingredients' },
      { status: 500 },
    );
  }
}
