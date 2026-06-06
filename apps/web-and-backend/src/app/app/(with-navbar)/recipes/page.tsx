import { RecipeDTO } from "shared";
import { JSENDResponse } from "shared";

import ErrorBox from "@/app/_ui/ErrorBox";

import { getAllRecipesForLoggedInUser } from "../../../_features/recipe/actions";
import PageWrapper from "../../../_ui/PageWrapper";
import RecipesDisplay from "./RecipesDisplay";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recetas",
  description: "Todas tus recetas",
};

export default async function RecipesPage() {
  const recipesResponse: JSENDResponse<RecipeDTO[]> =
    await getAllRecipesForLoggedInUser();

  const hasError = recipesResponse.status !== "success";

  return (
    <PageWrapper className="max-w-5xl">
      {hasError && (
        <ErrorBox>
          {recipesResponse.data?.message ||
            "Ha ocurrido un error al cargar tus recetas. Por favor, intenta nuevamente más tarde."}
        </ErrorBox>
      )}
      {!hasError && <RecipesDisplay recipes={recipesResponse.data} />}
    </PageWrapper>
  );
}
