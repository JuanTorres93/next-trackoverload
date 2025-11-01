import NewRecipeForm from '@/app/_features/recipe/NewRecipeForm';
import PageWrapper from '@/app/_ui/PageWrapper';
import { AppCreateRecipeUsecase } from '@/interface-adapters/app/use-cases/recipe';

export default async function NewRecipePage() {
  return (
    <PageWrapper>
      <NewRecipeForm />
    </PageWrapper>
  );
}
