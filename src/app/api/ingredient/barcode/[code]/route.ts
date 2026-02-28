import { NextRequest, NextResponse } from 'next/server';
import { AppIngredientFinder } from '@/interface-adapters/app/services/AppIngredientFinder';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import { JSENDResponse } from '@/app/_types/JSEND';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<JSENDResponse<IngredientFinderResult[]>>> {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json(
        { status: 'fail', data: { message: 'Missing barcode' } },
        { status: 400 },
      );
    }

    const foundIngredients: IngredientFinderResult[] =
      await AppIngredientFinder.findIngredientsByBarcode(code);

    return NextResponse.json(
      { status: 'success', data: foundIngredients },
      { status: 200 },
    );
  } catch (error) {
    console.log(
      'app/api/ingredient/barcode/[code]/GET: Error fetching ingredients:',
      error,
    );

    return NextResponse.json(
      { status: 'fail', data: { message: 'Failed to fetch ingredients' } },
      { status: 500 },
    );
  }
}
