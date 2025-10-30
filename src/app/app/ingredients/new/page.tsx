import NewIngredientForm from '@/app/_features/ingredient/NewIngredientForm';
import PageWrapper from '@/app/_ui/PageWrapper';

export const metadata = {
  title: 'New Ingredient',
  description: 'Create a new ingredient',
};

export default function NewIngredientPage() {
  return (
    <PageWrapper>
      <NewIngredientForm />
    </PageWrapper>
  );
}
