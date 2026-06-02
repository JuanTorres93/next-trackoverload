import { NextResponse } from "next/server";

import { JSENDResponse } from "shared";

import { DayEntry } from "../../../../../application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase";
import { AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays } from "../../../../../interface-adapters/app/use-cases/day";
import { ensureLoggedInUser } from "../../../_common/ensureLoggedInUser";
import { handleKnownErrors } from "../../../_common/handleKnownErrors";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ numberOfDays: string }> },
): Promise<NextResponse<JSENDResponse<DayEntry[]>>> {
  const { numberOfDays } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const days: DayEntry[] =
      await AppGetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays.execute(
        {
          numberOfDays: Number(numberOfDays),
          userId: currentUserId,
        },
      );

    const responseData: JSENDResponse<DayEntry[]> = {
      status: "success",
      data: days,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
