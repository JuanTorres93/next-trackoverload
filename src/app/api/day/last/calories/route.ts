import { NextResponse } from "next/server";

import { JSENDResponse } from "@/app/_types/JSEND";
import { ensureLoggedInUser } from "@/app/api/_common/ensureLoggedInUser";
import { DayDTO } from "@/application-layer/dtos/DayDTO";
import { AppGetLastDayWithCaloriesGoalForUserUsecase } from "@/interface-adapters/app/use-cases/day";

import { handleKnownErrors } from "../../../_common/handleKnownErrors";

export async function GET(
  _req: Request,
): Promise<NextResponse<JSENDResponse<DayDTO | null>>> {
  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const day: DayDTO | null =
      await AppGetLastDayWithCaloriesGoalForUserUsecase.execute({
        userId: currentUserId,
      });

    const responseData: JSENDResponse<DayDTO | null> = {
      status: "success",
      data: day,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
