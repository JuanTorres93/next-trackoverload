import { NextRequest, NextResponse } from 'next/server';
import { AppIngredientFinder } from '@/interface-adapters/app/services/AppIngredientFinder';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import { JSENDResponse } from '@/app/_types/JSEND';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
): Promise<NextResponse<JSENDResponse<IngredientFinderResult[]>>> {
  try {
    const { name } = await params;
    const term = decodeURIComponent(name || '').trim();

    if (!term) {
      return NextResponse.json(
        { status: 'fail', data: { message: 'Missing ingredient name' } },
        { status: 400 },
      );
    }

    const foundIngredients: IngredientFinderResult[] =
      await AppIngredientFinder.findIngredientsByFuzzyName(term);

    return NextResponse.json(
      { status: 'success', data: foundIngredients },
      { status: 200 },
    );
  } catch (error) {
    console.log(
      'app/api/ingredient/fuzzy/[name]/GET: Error fetching ingredients:',
      error,
    );

    return NextResponse.json(
      { status: 'fail', data: { message: 'Failed to fetch ingredients' } },
      { status: 500 },
    );
  }
}
