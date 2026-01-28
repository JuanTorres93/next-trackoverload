import { getAllRecipesForUser } from '@/app/_features/recipe/actions';
import RecipesGrid from '@/app/_features/recipe/RecipesGrid';
import ButtonNew from '@/app/_ui/ButtonNew';
import PageWrapper from '@/app/_ui/PageWrapper';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';

export const metadata = {
  title: 'Recetas',
  description: 'Todas tus recetas',
};

export default async function RecipesPage() {
  const recipes: RecipeDTO[] = await getAllRecipesForUser('dev-user'); // TODO get user id from session

  return (
    <PageWrapper>
      <ButtonNew href="/app/recipes/new" className="mb-4">
        Nueva Receta
      </ButtonNew>

      {recipes.length === 0 ? (
        <p className="text-center text-text-minor-emphasis">No hay recetas</p>
      ) : (
        <RecipesGrid data-testid="recipes-container" recipes={recipes} />
      )}
    </PageWrapper>
  );
}
