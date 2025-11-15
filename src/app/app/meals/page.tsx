import DaySummary from '@/app/_features/day/DaySummary';
import PageWrapper from '../../_ui/PageWrapper';

export const metadata = {
  title: 'Comidas',
  description: 'Planificación de comidas',
};

// TODO DELETE: This is for dev purposes only
import RecipeLine from '@/app/_features/recipe/RecipeLine';
import { AppGetRecipeByIdForUserUsecase } from '@/interface-adapters/app/use-cases/recipe';

export default async function Dashboard() {
  const recipe = await AppGetRecipeByIdForUserUsecase.execute({
    id: 'dd369c45-dc47-4758-a467-cd1c52510c9b',
    userId: 'dev-user',
  });

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <PageWrapper>
      <RecipeLine recipe={recipe} />
      <DaySummary />
    </PageWrapper>
  );
}
