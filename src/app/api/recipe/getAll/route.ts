import { NextRequest, NextResponse } from 'next/server';
import { AppGetAllRecipesForUserUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';
import { JSENDResponse } from '@/app/_types/JSEND';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<JSENDResponse<RecipeDTO[]>>> {
  try {
    const userId = await getCurrentUserId();

    const recipes: RecipeDTO[] = await AppGetAllRecipesForUserUsecase.execute({
      targetUserId: userId,
      actorUserId: userId,
    });

    return NextResponse.json(
      { status: 'success', data: recipes },
      { status: 200 },
    );
  } catch (error) {
    console.log('app/api/recipe/getAll: Error fetching recipes:', error);

    return NextResponse.json(
      { status: 'fail', data: { message: 'Failed to fetch recipes' } },
      { status: 500 },
    );
  }
}
