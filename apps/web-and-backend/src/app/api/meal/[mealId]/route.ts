import { NextResponse } from "next/server";

import { JSENDResponse } from "../../../_types/JSEND";
import { ensureLoggedInUser } from "../../_common/ensureLoggedInUser";
import { MealDTO } from "../../../../application-layer/dtos/MealDTO";
import { AppToggleIsEatenUsecase } from "../../../../interface-adapters/app/use-cases/meal";

import { handleKnownErrors } from "../../_common/handleKnownErrors";

export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ mealId: string }> },
): Promise<NextResponse<JSENDResponse<MealDTO>>> {
  const { mealId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const meal: MealDTO = await AppToggleIsEatenUsecase.execute({
      mealId,
      userId: currentUserId,
    });

    const responseData: JSENDResponse<MealDTO> = {
      status: "success",
      data: meal,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
