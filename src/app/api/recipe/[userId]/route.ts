import { NextResponse } from "next/server";

import { JSENDResponse } from "@/app/_types/JSEND";
import { ensureLoggedInUser } from "@/app/api/_common/ensureLoggedInUser";
import { RecipeDTO } from "@/application-layer/dtos/RecipeDTO";
import { AppGetAllRecipesForUserUsecase } from "@/interface-adapters/app/use-cases/recipe";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
): Promise<NextResponse<JSENDResponse<RecipeDTO[]>>> {
  const { userId } = params;

  const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
  if (notLoggedInResponse) return notLoggedInResponse;

  let recipes: RecipeDTO[];

  try {
    recipes = await AppGetAllRecipesForUserUsecase.execute({
      actorUserId: currentUserId,
      targetUserId: userId,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "test")
      console.error(`Error in GET /api/recipe/${userId}:`, error);

    const errorResponse: JSENDResponse<null> = {
      status: "fail",
      data: {
        message:
          (error as Error).message ||
          "An error occurred while fetching recipes",
      },
    };

    return NextResponse.json(errorResponse, { status: 404 });
  }

  const responseData: JSENDResponse<RecipeDTO[]> = {
    status: "success",
    data: recipes,
  };

  return NextResponse.json(responseData);
}
