import { NextRequest, NextResponse } from "next/server";

import { JSENDResponse } from "@/app/_types/JSEND";
import { ensureLoggedInUser } from "@/app/api/_common/ensureLoggedInUser";
import { DayDTO } from "@/application-layer/dtos/DayDTO";
import { ReplaceMealByAnotherMealForUserInDayUsecaseRequest } from "@/application-layer/use-cases/day/replace-foods/ReplaceMealByAnotherMealForUserInDay/ReplaceMealByAnotherMealForUserInDayUsecase";
import { ReplaceMealByFakeMealForUserInDayUsecaseRequest } from "@/application-layer/use-cases/day/replace-foods/ReplaceMealByFakeMealForUserInDay/ReplaceMealByFakeMealForUserInDayUsecase";
import {
  AppRemoveMealFromDayUsecase,
  AppReplaceMealByAnotherMealForUserInDayUsecase,
  AppReplaceMealByFakeMealForUserInDayUsecase,
} from "@/interface-adapters/app/use-cases/day";

import { handleKnownErrors } from "../../../../_common/handleKnownErrors";

type ReplaceByAnotherMealBody = Pick<
  ReplaceMealByAnotherMealForUserInDayUsecaseRequest,
  "recipeId"
>;
type ReplaceByFakeMealBody = Pick<
  ReplaceMealByFakeMealForUserInDayUsecaseRequest,
  "name" | "calories" | "protein"
>;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ dayId: string; mealId: string }> },
): Promise<NextResponse<JSENDResponse<DayDTO>>> {
  const { dayId, mealId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const body: ReplaceByAnotherMealBody | ReplaceByFakeMealBody =
      await req.json();

    let day: DayDTO;

    if ("recipeId" in body) {
      day = await AppReplaceMealByAnotherMealForUserInDayUsecase.execute({
        dayId,
        userId: currentUserId,
        mealToReplaceId: mealId,
        recipeId: body.recipeId,
      });
    } else {
      day = await AppReplaceMealByFakeMealForUserInDayUsecase.execute({
        dayId,
        userId: currentUserId,
        mealIdToReplace: mealId,
        name: body.name,
        calories: body.calories,
        protein: body.protein,
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ dayId: string; mealId: string }> },
): Promise<NextResponse<JSENDResponse<DayDTO>>> {
  const { dayId, mealId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const day: DayDTO = await AppRemoveMealFromDayUsecase.execute({
      dayId,
      userId: currentUserId,
      mealId,
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
