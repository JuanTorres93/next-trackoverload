import PageWrapper from '@/app/_ui/PageWrapper';
import { AppCreateRecipeUsecase } from '@/interface-adapters/app/use-cases/recipe';

export default async function NewRecipePage() {
  return (
    <PageWrapper>
      <h1 className="mb-4 text-2xl font-bold">Crear Nueva Receta</h1>
    </PageWrapper>
  );
}
