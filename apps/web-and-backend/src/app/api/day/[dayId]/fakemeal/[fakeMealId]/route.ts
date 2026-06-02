import { NextResponse } from "next/server";

import { DayDTO } from "shared";

import { AppRemoveFakeMealFromDayUsecase } from "../../../../../../interface-adapters/app/use-cases/day";
import { JSENDResponse } from "../../../../../_types/JSEND";
import { ensureLoggedInUser } from "../../../../_common/ensureLoggedInUser";
import { handleKnownErrors } from "../../../../_common/handleKnownErrors";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ dayId: string; fakeMealId: string }> },
): Promise<NextResponse<JSENDResponse<DayDTO>>> {
  const { dayId, fakeMealId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const day: DayDTO = await AppRemoveFakeMealFromDayUsecase.execute({
      dayId,
      userId: currentUserId,
      fakeMealId,
    });

    const responseData: JSENDResponse<DayDTO> = {
      status: "success",
      data: day,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
