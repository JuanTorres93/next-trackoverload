import { NextRequest, NextResponse } from "next/server";

import { JSENDResponse } from "@/app/_types/JSEND";
import { ensureLoggedInUser } from "@/app/api/_common/ensureLoggedInUser";
import { DayDTO } from "@/application-layer/dtos/DayDTO";
import { ReplaceFakeMealByAnotherFakeMealForUserInDayUsecaseRequest } from "@/application-layer/use-cases/day/replace-foods/ReplaceFakeMealByAnotherFakeMealForUserInDay/ReplaceFakeMealByAnotherFakeMealForUserInDayUsecase";
import { ReplaceFakeMealByMealForUserInDayUsecaseRequest } from "@/application-layer/use-cases/day/replace-foods/ReplaceFakeMealByMealForUserInDay/ReplaceFakeMealByMealForUserInDayUsecase";
import {
  AppRemoveFakeMealFromDayUsecase,
  AppReplaceFakeMealByAnotherFakeMealForUserInDayUsecase,
  AppReplaceFakeMealByMealForUserInDayUsecase,
} from "@/interface-adapters/app/use-cases/day";

import { handleKnownErrors } from "../../../../_common/handleKnownErrors";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ dayId: string; fakeMealId: string }> },
): Promise<NextResponse<JSENDResponse<DayDTO>>> {
  const { dayId, fakeMealId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const body: ReplaceByAnotherFakeMealBody | ReplaceByMealBody =
      await req.json();

    let day: DayDTO;

    if ("recipeId" in body) {
      day = await AppReplaceFakeMealByMealForUserInDayUsecase.execute({
        dayId,
        userId: currentUserId,
        fakeMealIdToReplace: fakeMealId,
        recipeId: body.recipeId,
      });
    } else {
      day =
        await AppReplaceFakeMealByAnotherFakeMealForUserInDayUsecase.execute({
          dayId,
          userId: currentUserId,
          fakeMealIdToReplace: fakeMealId,
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

type ReplaceByAnotherFakeMealBody = Pick<
  ReplaceFakeMealByAnotherFakeMealForUserInDayUsecaseRequest,
  "name" | "calories" | "protein"
>;
type ReplaceByMealBody = Pick<
  ReplaceFakeMealByMealForUserInDayUsecaseRequest,
  "recipeId"
>;
