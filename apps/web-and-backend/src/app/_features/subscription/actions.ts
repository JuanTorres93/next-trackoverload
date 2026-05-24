"use server";

import { AppGetPlanInfoUsecase } from "../../../interface-adapters/app/use-cases/subscription";

export async function getPlanInfo() {
  return AppGetPlanInfoUsecase.execute();
}
