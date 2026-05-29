import { NextResponse } from "next/server";

import { AssembledDayDTO } from "../../../../../application-layer/dtos/AssembledDayDTO";
import { AppGetAssembledDayById } from "../../../../../interface-adapters/app/use-cases/day";
import { JSENDResponse } from "../../../../_types/JSEND";
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
