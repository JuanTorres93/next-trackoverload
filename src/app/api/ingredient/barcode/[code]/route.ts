import { NextRequest, NextResponse } from "next/server";

import { JSENDResponse } from "@/app/_types/JSEND";
import { getClientId } from "@/app/api/_common/getClientId";
import { IngredientFinderResult } from "@/domain/services/IngredientFinder.port";
import { createAppFindIngredientByBarcodeUsecase } from "@/interface-adapters/app/use-cases/ingredient/FindIngredientByBarcode/findIngredientByBarcode";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse<JSENDResponse<IngredientFinderResult[]>>> {
  try {
    const { code } = await params;
    const clientId = getClientId(request);

    if (!code) {
      return NextResponse.json(
        { status: "fail", data: { message: "Missing barcode" } },
        { status: 400 },
      );
    }

    const foundIngredients: IngredientFinderResult[] =
      await createAppFindIngredientByBarcodeUsecase(clientId).execute({
        barcode: code,
      });

    return NextResponse.json(
      { status: "success", data: foundIngredients },
      { status: 200 },
    );
  } catch (error) {
    console.log(
      "app/api/ingredient/barcode/[code]/GET: Error fetching ingredients:",
      error,
    );

    return NextResponse.json(
      { status: "fail", data: { message: "Failed to fetch ingredients" } },
      { status: 500 },
    );
  }
}
