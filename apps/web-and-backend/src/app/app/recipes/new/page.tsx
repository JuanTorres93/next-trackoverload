import NewRecipeForm from "../../../_features/recipe/NewRecipeForm/NewRecipeForm";
import PageWrapper from "../../../_ui/PageWrapper";

export const metadata = {
  title: "Nueva receta",
  description: "Crear una nueva receta",
};

export default async function NewRecipePage() {
  return (
    <PageWrapper>
      <NewRecipeForm />
    </PageWrapper>
  );
}
