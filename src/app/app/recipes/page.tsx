import { getAllRecipesForLoggedInUser } from '@/app/_features/recipe/actions';
import PageWrapper from '@/app/_ui/PageWrapper';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import RecipesDisplay from './RecipesDisplay';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Recetas',
  description: 'Todas tus recetas',
};

export default async function RecipesPage() {
  const recipes: RecipeDTO[] = await getAllRecipesForLoggedInUser();

  return (
    <PageWrapper>
      <RecipesDisplay recipes={recipes} />
    </PageWrapper>
  );
}
