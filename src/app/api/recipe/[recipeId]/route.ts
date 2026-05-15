import { NextRequest, NextResponse } from "next/server";

import { JSENDResponse } from "@/app/_types/JSEND";
import { ensureLoggedInUser } from "@/app/api/_common/ensureLoggedInUser";
import { RecipeDTO } from "@/application-layer/dtos/RecipeDTO";
import { AddIngredientToRecipeUsecaseRequest } from "@/application-layer/use-cases/recipe/AddIngredientToRecipe/AddIngredientToRecipe.usecase";
import { UpdateRecipeUsecaseRequest } from "@/application-layer/use-cases/recipe/UpdateRecipe/UpdateRecipe.usecase";
import { UpdateRecipeImageUsecaseRequest } from "@/application-layer/use-cases/recipe/UpdateRecipeImage/UpdateRecipeImageUsecase";
import {
  AppAddIngredientToRecipeUsecase,
  AppDeleteRecipeUsecase,
  AppUpdateRecipeImageUsecase,
  AppUpdateRecipeUsecase,
} from "@/interface-adapters/app/use-cases/recipe";

import { handleKnownErrors } from "../../_common/handleKnownErrors";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> },
): Promise<NextResponse<JSENDResponse<RecipeDTO>>> {
  const { recipeId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const body: AddIngredientBody = await req.json();

    const recipe: RecipeDTO = await AppAddIngredientToRecipeUsecase.execute({
      ...body,
      recipeId,
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ recipeId: string }> },
): Promise<NextResponse<JSENDResponse<null>>> {
  const { recipeId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    await AppDeleteRecipeUsecase.execute({
      id: recipeId,
      userId: currentUserId,
    });

    const responseData: JSENDResponse<null> = {
      status: "success",
      data: null,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> },
): Promise<NextResponse<JSENDResponse<RecipeDTO>>> {
  const { recipeId } = await params;

  try {
    const { currentUserId, notLoggedInResponse } = await ensureLoggedInUser();
    if (notLoggedInResponse) return notLoggedInResponse;

    const body: UpdateRecipeBody | UpdateRecipeImageBody = await req.json();

    let recipe: RecipeDTO;

    if ("imageData" in body) {
      recipe = (await AppUpdateRecipeImageUsecase.execute({
        recipeId,
        userId: currentUserId,
        imageData: Buffer.from(body.imageData),
      })) as RecipeDTO;
    } else {
      recipe = await AppUpdateRecipeUsecase.execute({
        ...body,
        id: recipeId,
        userId: currentUserId,
      });
    }

    const responseData: JSENDResponse<RecipeDTO> = {
      status: "success",
      data: recipe,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    return handleKnownErrors(error as Error);
  }
}

type AddIngredientBody = Omit<
  AddIngredientToRecipeUsecaseRequest,
  "recipeId" | "userId"
>;
type UpdateRecipeBody = Omit<UpdateRecipeUsecaseRequest, "id" | "userId">;
type UpdateRecipeImageBody = Pick<UpdateRecipeImageUsecaseRequest, "imageData">;
