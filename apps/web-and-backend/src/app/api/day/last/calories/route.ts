import { NextResponse } from "next/server";

import { DayDTO } from "shared";
import { JSENDResponse } from "shared";

import { AppGetLastDayWithCaloriesGoalForUserUsecase } from "../../../../../interface-adapters/app/use-cases/day";
import { ensureLoggedInUser } from "../../../_common/ensureLoggedInUser";
import { handleKnownErrors } from "../../../_common/handleKnownErrors";

export async function GET(): Promise<
  NextResponse<JSENDResponse<DayDTO | null>>
> {
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
