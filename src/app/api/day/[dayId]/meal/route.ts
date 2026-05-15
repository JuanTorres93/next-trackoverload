import { NextRequest, NextResponse } from "next/server";

import { JSENDResponse } from "@/app/_types/JSEND";
import { ensureLoggedInUser } from "@/app/api/_common/ensureLoggedInUser";
import { DayDTO } from "@/application-layer/dtos/DayDTO";
import { AddMultipleMealsToDayUsecaseRequest } from "@/application-layer/use-cases/day/AddMultipleMealsToDay/AddMultipleMealsToDay.usecase";
import { AppAddMultipleMealsToDayUsecase } from "@/interface-adapters/app/use-cases/day";

import { handleKnownErrors } from "../../../_common/handleKnownErrors";

type AddMultipleMealsBody = Pick<
  AddMultipleMealsToDayUsecaseRequest,
  "recipeIds"
>;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ dayId: string }> },
): Promise<NextResponse<JSENDResponse<DayDTO>>> {
  const { dayId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const body: AddMultipleMealsBody = await req.json();

    const day: DayDTO = await AppAddMultipleMealsToDayUsecase.execute({
      dayId,
      userId: currentUserId,
      recipeIds: body.recipeIds,
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
