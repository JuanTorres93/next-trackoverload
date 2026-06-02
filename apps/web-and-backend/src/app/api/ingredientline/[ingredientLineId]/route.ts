import { NextRequest, NextResponse } from "next/server";

import { IngredientLineDTO } from "shared";
import { JSENDResponse } from "shared";

import { UpdateIngredientLineUsecaseRequest } from "../../../../application-layer/use-cases/ingredientline/UpdateIngredientLine/UpdateIngredientLine.usecase";
import { AppUpdateIngredientLineUsecase } from "../../../../interface-adapters/app/use-cases/ingredientline";
import { ensureLoggedInUser } from "../../_common/ensureLoggedInUser";
import { handleKnownErrors } from "../../_common/handleKnownErrors";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ ingredientLineId: string }> },
): Promise<NextResponse<JSENDResponse<IngredientLineDTO>>> {
  const { ingredientLineId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const body: UpdateIngredientLineBody = await req.json();

    const ingredientLine = await AppUpdateIngredientLineUsecase.execute({
      ...body,
      ingredientLineId,
      userId: currentUserId,
    });

    const responseData: JSENDResponse<IngredientLineDTO> = {
      status: "success",
      data: ingredientLine,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}

type UpdateIngredientLineBody = Omit<
  UpdateIngredientLineUsecaseRequest,
  "ingredientLineId" | "userId"
>;
