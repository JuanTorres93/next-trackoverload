import RecipeCard from '@/app/_features/recipe/RecipeCard';
import ButtonNew from '@/app/_ui/ButtonNew';
import PageWrapper from '@/app/_ui/PageWrapper';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { AppGetAllRecipesForUserUsecase } from '@/interface-adapters/app/use-cases/recipe/GetAllRecipesForUser/getAllRecipesForUser';

export const metadata = {
  title: 'Recetas',
  description: 'Todas tus recetas',
};

export default async function RecipesPage() {
  const recipes: RecipeDTO[] = await AppGetAllRecipesForUserUsecase.execute({
    userId: 'dev-user',
  }); // TODO IMPORTANT get user id from session

  return (
    <PageWrapper>
      <ButtonNew href="/app/recipes/new" className="mb-4">
        Nueva Receta
      </ButtonNew>
      {recipes.length === 0 ? (
        <p className="text-center text-zinc-500">No hay recetas</p>
      ) : (
        <div
          data-testid="recipes-container"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
