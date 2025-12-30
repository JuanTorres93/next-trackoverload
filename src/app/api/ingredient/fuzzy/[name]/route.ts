import type { NextRequest } from 'next/server';
import { AppIngredientFinder } from '@/interface-adapters/app/services/AppIngredientFinder';

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

    const ingredients = await AppIngredientFinder.findIngredientsByFuzzyName(
      term
    );

    // User can decide not to use an ingredient. So id is faked until it is actually used.
    const fakeIngredients = ingredients.map((ingredient, index) => ({
      ...ingredient,
      id: `fake-id-${index}-${ingredient.externalId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    return Response.json(fakeIngredients, { status: 200 });
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
