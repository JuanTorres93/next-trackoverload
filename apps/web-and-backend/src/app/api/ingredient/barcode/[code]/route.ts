import { NextRequest, NextResponse } from "next/server";

import { JSENDResponse } from "shared";

import { handleKnownErrors } from "@/app/api/_common/handleKnownErrors";

import { IngredientFinderResult } from "../../../../../domain/services/IngredientFinder.port";
import { createAppFindIngredientByBarcodeUsecase } from "../../../../../interface-adapters/app/use-cases/ingredient/AppFindIngredientByBarcodeUsecase";
import { getClientId } from "../../../_common/getClientId";

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

    return handleKnownErrors(error as Error);
  }
}
