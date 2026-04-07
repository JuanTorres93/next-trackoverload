import { NextRequest, NextResponse } from "next/server";

import { JSENDResponse } from "@/app/_types/JSEND";
import { getClientId } from "@/app/api/_common/getClientId";
import { IngredientFinderResult } from "@/domain/services/IngredientFinder.port";
import { createAppFindIngredientByFuzzyNameUsecase } from "@/interface-adapters/app/use-cases/ingredient/FindIngredientByFuzzyName/findIngredientByFuzzyName";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
): Promise<NextResponse<JSENDResponse<IngredientFinderResult[]>>> {
  try {
    const { name } = await params;
    const term = decodeURIComponent(name || "").trim();
    const clientId = getClientId(request);
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);

    if (!term) {
      return NextResponse.json(
        { status: "fail", data: { message: "Missing ingredient name" } },
        { status: 400 },
      );
    }

    const foundIngredients: IngredientFinderResult[] =
      await createAppFindIngredientByFuzzyNameUsecase(clientId).execute({
        name: term,
        page,
      });

    return NextResponse.json(
      { status: "success", data: foundIngredients },
      { status: 200 },
    );
  } catch (error) {
    console.log(
      "app/api/ingredient/fuzzy/[name]/GET: Error fetching ingredients:",
      error,
    );

    return NextResponse.json(
      { status: "fail", data: { message: "Failed to fetch ingredients" } },
      { status: 500 },
    );
  }
}
