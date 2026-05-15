import { NextRequest, NextResponse } from "next/server";

import { JSENDResponse } from "@/app/_types/JSEND";
import { ensureLoggedInUser } from "@/app/api/_common/ensureLoggedInUser";
import { DayDTO } from "@/application-layer/dtos/DayDTO";
import { SetCaloriesGoalForDayAndUserUsecaseRequest } from "@/application-layer/use-cases/day/SetCaloriesGoalForDayAndUser/SetCaloriesGoalForDayAndUserUsecase";
import { UpdateUserWeightForDayUsecaseRequest } from "@/application-layer/use-cases/day/UpdateUserWeightForDay/UpdateUserWeightForDayUsecase";
import {
  AppSetCaloriesGoalForDayAndUserUsecase,
  AppUpdateUserWeightForDayUsecase,
} from "@/interface-adapters/app/use-cases/day";

import { handleKnownErrors } from "../../_common/handleKnownErrors";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ dayId: string }> },
): Promise<NextResponse<JSENDResponse<DayDTO>>> {
  const { dayId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const body: SetCaloriesGoalBody | UpdateWeightBody = await req.json();

    let day: DayDTO;

    if ("newCaloriesGoal" in body) {
      day = await AppSetCaloriesGoalForDayAndUserUsecase.execute({
        dayId,
        userId: currentUserId,
        newCaloriesGoal: body.newCaloriesGoal,
      });
    } else {
      day = await AppUpdateUserWeightForDayUsecase.execute({
        dayId,
        userId: currentUserId,
        newWeightInKg: body.newWeightInKg,
      });
    }

    const responseData: JSENDResponse<DayDTO> = {
      status: "success",
      data: day,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}

type SetCaloriesGoalBody = Pick<
  SetCaloriesGoalForDayAndUserUsecaseRequest,
  "newCaloriesGoal"
>;
type UpdateWeightBody = Pick<
  UpdateUserWeightForDayUsecaseRequest,
  "newWeightInKg"
>;
