import { NextResponse } from "next/server";

import { AssembledDayDTO } from "shared";
import { JSENDResponse } from "shared";

import { AppGetAssembledDayById } from "../../../../../interface-adapters/app/use-cases/day";
import { ensureLoggedInUser } from "../../../_common/ensureLoggedInUser";
import { handleKnownErrors } from "../../../_common/handleKnownErrors";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ dayId: string }> },
): Promise<NextResponse<JSENDResponse<AssembledDayDTO | null>>> {
  const { dayId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const day: AssembledDayDTO | null = await AppGetAssembledDayById.execute({
      dayId,
      userId: currentUserId,
    });

    const responseData: JSENDResponse<AssembledDayDTO | null> = {
      status: "success",
      data: day,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
