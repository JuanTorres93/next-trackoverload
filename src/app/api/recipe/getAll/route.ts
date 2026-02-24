import type { NextRequest } from 'next/server';
import { AppGetAllRecipesForUserUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { getCurrentUserId } from '@/app/_utils/auth/getCurrentUserId';

export async function GET(_req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const recipes: RecipeDTO[] = await AppGetAllRecipesForUserUsecase.execute({
      targetUserId: userId,
      actorUserId: userId,
    });

    return Response.json(recipes, { status: 200 });
  } catch (error) {
    console.log('app/api/recipe/GET: Error fetching recipes:', error);
    return Response.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}
