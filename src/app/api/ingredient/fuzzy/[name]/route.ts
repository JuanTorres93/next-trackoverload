import type { NextRequest } from 'next/server';
import { AppIngredientFinder } from '@/interface-adapters/app/services/AppIngredientFinder';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const term = decodeURIComponent(name || '').trim();

    if (!term) {
      return Response.json(
        { error: 'Missing ingredient name' },
        { status: 400 }
      );
    }

    const foundIngredients: IngredientFinderResult[] =
      await AppIngredientFinder.findIngredientsByFuzzyName(term);

    return Response.json(foundIngredients, { status: 200 });
  } catch (error) {
    console.log(
      'app/api/ingredient/fuzzy/[name]/GET: Error fetching ingredients:',
      error
    );
    return Response.json(
      { error: 'Failed to fetch ingredients' },
      { status: 500 }
    );
  }
}
