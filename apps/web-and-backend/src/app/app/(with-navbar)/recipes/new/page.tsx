import PageTitle from "@/app/_ui/typography/PageTitle";

import NewRecipeForm from "../../../../_features/recipe/NewRecipeForm/NewRecipeForm";
import PageWrapper from "../../../../_ui/PageWrapper";

export const metadata = {
  title: "Nueva receta",
  description: "Crear una nueva receta",
};

export default async function NewRecipePage() {
  return (
    <PageWrapper>
      <PageTitle
        title="Nueva receta"
        subtitle="Busca ingredientes y ajusta las cantidades"
        className="mb-6"
      />

      <NewRecipeForm />
    </PageWrapper>
  );
}
