import { NextResponse } from "next/server";

import { JSENDResponse } from "../../../../../_types/JSEND";
import { ensureLoggedInUser } from "../../../../_common/ensureLoggedInUser";
import { RecipeDTO } from "../../../../../../application-layer/dtos/RecipeDTO";
import { AppGetRecipeByIdForUserUsecase } from "../../../../../../interface-adapters/app/use-cases/recipe";

import { handleKnownErrors } from "../../../../_common/handleKnownErrors";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ recipeId: string; userId: string }> },
): Promise<NextResponse<JSENDResponse<RecipeDTO | null>>> {
  const { recipeId, userId } = await params;

  try {
    const { notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const recipe: RecipeDTO | null =
      await AppGetRecipeByIdForUserUsecase.execute({
        id: recipeId,
        userId,
      });

    const responseData: JSENDResponse<RecipeDTO | null> = {
      status: "success",
      data: recipe,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
