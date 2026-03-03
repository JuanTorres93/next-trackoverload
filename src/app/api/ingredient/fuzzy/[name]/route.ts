import { NextRequest, NextResponse } from 'next/server';
import { createAppIngredientFinder } from '@/interface-adapters/app/services/AppIngredientFinder';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import { JSENDResponse } from '@/app/_types/JSEND';
import { getClientId } from '@/app/api/_common/getClientId';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
): Promise<NextResponse<JSENDResponse<IngredientFinderResult[]>>> {
  try {
    const { name } = await params;
    const term = decodeURIComponent(name || '').trim();
    const clientId = getClientId(request);

    // TODO IMPORTANT DELETE THESE DEBUG LOGS. I NEED TO INCLUDE THEM TO SEE THE LOGS IN THE DEPLOYMENT
    console.log('clientId');
    console.log(clientId);

    if (!term) {
      return NextResponse.json(
        { status: 'fail', data: { message: 'Missing ingredient name' } },
        { status: 400 },
      );
    }

    const foundIngredients: IngredientFinderResult[] =
      await createAppIngredientFinder(clientId).findIngredientsByFuzzyName(
        term,
      );

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
