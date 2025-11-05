import { AppGetRecipeByIdForUserUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import PageWrapper from '@/app/_ui/PageWrapper';

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

  if (!recipe) return <PageWrapper>No recipe found</PageWrapper>;
  return (
    <PageWrapper>
      <h2>{recipe.name}</h2>

      <p>Recipe ID: {recipe.id}</p>
      <p>Calories: {recipe.calories}</p>
      <p>Protein: {recipe.protein}</p>
      {recipe.ingredientLines.length > 0 ? (
        <div>
          <h3>Ingredient Lines:</h3>
          <ul>
            {recipe.ingredientLines.map((line) => (
              <li key={line.id}>
                IngredientLine ID: {line.id}, Ingredient ID:{' '}
                {line.ingredient.id}, Quantity (grams): {line.quantityInGrams}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No ingredient lines found.</p>
      )}
    </PageWrapper>
  );
}
