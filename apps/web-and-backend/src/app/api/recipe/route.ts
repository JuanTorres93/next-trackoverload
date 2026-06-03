import { NextRequest, NextResponse } from "next/server";

import { RecipeDTO } from "shared";
import { JSENDResponse } from "shared";

import { CreateRecipeUsecaseRequest } from "../../../application-layer/use-cases/recipe/CreateRecipe/CreateRecipe.usecase";
import { AppCreateRecipeUsecase } from "../../../interface-adapters/app/use-cases/recipe";
import { ensureLoggedInUser } from "../_common/ensureLoggedInUser";
import { handleKnownErrors } from "../_common/handleKnownErrors";

type CreateRecipeBody = Omit<CreateRecipeUsecaseRequest, "actorUserId">;

export async function POST(
  req: NextRequest,
): Promise<NextResponse<JSENDResponse<RecipeDTO>>> {
  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();

    if (notLoggedInResponse) return notLoggedInResponse;

    const body: CreateRecipeBody = await req.json();
    const { targetUserId, name, ingredientLinesInfo, imageBuffer } = body;

    const recipe: RecipeDTO = await AppCreateRecipeUsecase.execute({
      actorUserId: currentUserId,
      targetUserId,
      name,
      ingredientLinesInfo,
      imageBuffer: imageBuffer ? Buffer.from(imageBuffer) : undefined,
    });

    const responseData: JSENDResponse<RecipeDTO> = {
      status: "success",
      data: recipe,
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
