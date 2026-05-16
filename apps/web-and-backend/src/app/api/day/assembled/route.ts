import { NextRequest, NextResponse } from "next/server";

import { JSENDResponse } from "../../../_types/JSEND";
import { ensureLoggedInUser } from "../../_common/ensureLoggedInUser";
import { AssembledDayDTO } from "../../../../application-layer/dtos/AssembledDayDTO";
import { AppGetMultipleAssembledDaysByIds } from "../../../../interface-adapters/app/use-cases/day";

import { handleKnownErrors } from "../../_common/handleKnownErrors";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<JSENDResponse<AssembledDayDTO[]>>> {
  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const idsParam = new URL(req.url).searchParams.get("ids") ?? "";
    const dayIds = idsParam ? idsParam.split(",") : [];

    const days: AssembledDayDTO[] =
      await AppGetMultipleAssembledDaysByIds.execute({
        dayIds,
        userId: currentUserId,
      });

    const responseData: JSENDResponse<AssembledDayDTO[]> = {
      status: "success",
      data: days,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
