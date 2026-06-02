import { NextRequest, NextResponse } from "next/server";

import { DayDTO } from "shared";

import { AddMultipleMealsToMultipleDaysUsecaseRequest } from "../../../../../application-layer/use-cases/day/AddMultipleMealsToMultipleDays/AddMultipleMealsToMultipleDays.usecase";
import { AppAddMultipleMealsToMultipleDaysUsecase } from "../../../../../interface-adapters/app/use-cases/day";
import { JSENDResponse } from "../../../../_types/JSEND";
import { ensureLoggedInUser } from "../../../_common/ensureLoggedInUser";
import { handleKnownErrors } from "../../../_common/handleKnownErrors";

type AddMultipleMealsToBatchBody = Omit<
  AddMultipleMealsToMultipleDaysUsecaseRequest,
  "userId"
>;

export async function POST(
  req: NextRequest,
): Promise<NextResponse<JSENDResponse<DayDTO[]>>> {
  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const body: AddMultipleMealsToBatchBody = await req.json();

    const days: DayDTO[] =
      await AppAddMultipleMealsToMultipleDaysUsecase.execute({
        ...body,
        userId: currentUserId,
      });

    const responseData: JSENDResponse<DayDTO[]> = {
      status: "success",
      data: days,
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
