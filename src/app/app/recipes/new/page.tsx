import NewRecipeForm from '@/app/_features/recipe/NewRecipeForm';
import PageWrapper from '@/app/_ui/PageWrapper';

export default async function NewRecipePage() {
  return (
    <PageWrapper>
      <NewRecipeForm />
    </PageWrapper>
  );
}
