import { NextResponse } from "next/server";

import { JSENDResponse } from "../../../../../_types/JSEND";
import { ensureLoggedInUser } from "../../../../_common/ensureLoggedInUser";
import { RecipeDTO } from "../../../../../../application-layer/dtos/RecipeDTO";
import { AppRemoveIngredientFromRecipeUsecase } from "../../../../../../interface-adapters/app/use-cases/recipe";

import { handleKnownErrors } from "../../../../_common/handleKnownErrors";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ recipeId: string; ingredientId: string }> },
): Promise<NextResponse<JSENDResponse<RecipeDTO>>> {
  const { recipeId, ingredientId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const recipe: RecipeDTO =
      await AppRemoveIngredientFromRecipeUsecase.execute({
        recipeId,
        ingredientId,
        userId: currentUserId,
      });

    const responseData: JSENDResponse<RecipeDTO> = {
      status: "success",
      data: recipe,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
