import { NextResponse } from "next/server";

import { RecipeDTO } from "shared";
import { JSENDResponse } from "shared";

import { AppGetAllRecipesForUserUsecase } from "../../../../../interface-adapters/app/use-cases/recipe";
import { ensureLoggedInUser } from "../../../_common/ensureLoggedInUser";
import { handleKnownErrors } from "../../../_common/handleKnownErrors";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
): Promise<NextResponse<JSENDResponse<RecipeDTO[]>>> {
  const { userId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const recipes: RecipeDTO[] = await AppGetAllRecipesForUserUsecase.execute({
      actorUserId: currentUserId,
      targetUserId: userId,
    });

    const responseData: JSENDResponse<RecipeDTO[]> = {
      status: "success",
      data: recipes,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}
