import { AppGetRecipeByIdForUserUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';

export default async function RecipePage({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;
  const recipe: RecipeDTO | null = await AppGetRecipeByIdForUserUsecase.execute(
    {
      id: recipeId,
      userId: 'dev-user', // TODO IMPORTANT: Replace with actual user ID from authenticated user
    }
  );

  if (!recipe) return <div>No recipe found</div>;
  return (
    <div className="p-6">
      <h2>{recipe.name}</h2>
    </div>
  );
}
