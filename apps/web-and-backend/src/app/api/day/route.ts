import { NextRequest, NextResponse } from "next/server";

import { DayDTO } from "shared";
import { JSENDResponse } from "shared";

import { CreateDayUsecaseRequest } from "../../../application-layer/use-cases/day/CreateDay/CreateDay.usecase";
import { AppCreateDayUsecase } from "../../../interface-adapters/app/use-cases/day";
import { ensureLoggedInUser } from "../_common/ensureLoggedInUser";
import { handleKnownErrors } from "../_common/handleKnownErrors";

export type CreateDayBody = Omit<CreateDayUsecaseRequest, "actorUserId">;

export async function POST(
  req: NextRequest,
): Promise<NextResponse<JSENDResponse<DayDTO>>> {
  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const body: CreateDayBody = await req.json();

    const day: DayDTO = await AppCreateDayUsecase.execute({
      ...body,
      actorUserId: currentUserId,
    });

    const responseData: JSENDResponse<DayDTO> = {
      status: "success",
      data: day,
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
