import NewRecipeForm from '@/app/_features/recipe/NewRecipeForm';
import PageWrapper from '@/app/_ui/PageWrapper';

export const metadata = {
  title: 'Nueva receta',
  description: 'Crear una nueva receta',
};

export default async function NewRecipePage() {
  return (
    <PageWrapper>
      <NewRecipeForm />
    </PageWrapper>
  );
}
