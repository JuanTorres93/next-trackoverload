import { NextRequest, NextResponse } from "next/server";

import { JSENDResponse } from "../../../../_types/JSEND";
import { ensureLoggedInUser } from "../../../_common/ensureLoggedInUser";
import { RecipeDTO } from "../../../../../application-layer/dtos/RecipeDTO";
import { DuplicateRecipeUsecaseRequest } from "../../../../../application-layer/use-cases/recipe/DuplicateRecipe/DuplicateRecipe.usecase";
import { AppDuplicateRecipeUsecase } from "../../../../../interface-adapters/app/use-cases/recipe";

import { handleKnownErrors } from "../../../_common/handleKnownErrors";

type DuplicateRecipeBody = Pick<DuplicateRecipeUsecaseRequest, "newName">;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> },
): Promise<NextResponse<JSENDResponse<RecipeDTO>>> {
  const { recipeId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const body: DuplicateRecipeBody = await req.json();

    const recipe: RecipeDTO = await AppDuplicateRecipeUsecase.execute({
      recipeId,
      userId: currentUserId,
      newName: body.newName,
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
