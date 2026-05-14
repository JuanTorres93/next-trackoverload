import { NextResponse } from "next/server";

import { JSENDResponse } from "@/app/_types/JSEND";
import { RecipeDTO } from "@/application-layer/dtos/RecipeDTO";
import { AppGetAllRecipesForUserUsecase } from "@/interface-adapters/app/use-cases/recipe";

import { getClientId } from "../../_common/getClientId";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
): Promise<NextResponse<JSENDResponse<RecipeDTO[]>>> {
  const { userId } = params;

  // TODO NEXT: get client id from auth token

  let recipes: RecipeDTO[];

  try {
    recipes = await AppGetAllRecipesForUserUsecase.execute({
      actorUserId: userId,
      targetUserId: userId,
    });
  } catch (error) {
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
