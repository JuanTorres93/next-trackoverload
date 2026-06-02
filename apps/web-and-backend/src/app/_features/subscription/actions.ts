"use server";

import { JSENDResponse } from "shared";

import { PlanInfo } from "@/domain/services/PaymentsService.port";

import { AppGetPlanInfoUsecase } from "../../../interface-adapters/app/use-cases/subscription";
import { handleActionErrors } from "../common/handleActionErrors";

export async function getPlanInfo(): Promise<JSENDResponse<PlanInfo>> {
  try {
    const planInfo = await AppGetPlanInfoUsecase.execute();

    return {
      status: "success",
      data: planInfo,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}
