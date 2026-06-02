import { NextResponse } from "next/server";

import { JSENDResponse } from "shared";

import { PlanInfo } from "../../../../domain/services/PaymentsService.port";
import { AppGetPlanInfoUsecase } from "../../../../interface-adapters/app/use-cases/subscription";

export async function GET(): Promise<NextResponse<JSENDResponse<PlanInfo>>> {
  try {
    const planInfo = await AppGetPlanInfoUsecase.execute();

    return NextResponse.json(
      { status: "success", data: planInfo },
      { status: 200 },
    );
  } catch (error) {
    console.log("api/subscription/plan: Error getting plan info:", error);

    return NextResponse.json(
      { status: "fail", data: { message: "Failed to get plan info" } },
      { status: 500 },
    );
  }
}
