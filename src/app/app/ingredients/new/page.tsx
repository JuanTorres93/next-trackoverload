import NewIngredientForm from '@/app/_features/ingredient/NewIngredientForm';
import PageWrapper from '@/app/_ui/PageWrapper';

export const metadata = {
  title: 'Nuevo ingrediente',
  description: 'Crear un nuevo ingrediente',
};

export default function NewIngredientPage() {
  return (
    <PageWrapper>
      <NewIngredientForm />
    </PageWrapper>
  );
}
