import { JSENDResponse, RecipeDTO } from "shared";

import { getAllRecipesForLoggedInUser } from "@/app/_features/recipe/actions";
import RecipesGrid from "@/app/_features/recipe/redesign/RecipesGrid";
import Screen from "@/app/_ui/Screen";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recetas",
  description: "Todas tus recetas",
};

export default async function RecipesPage() {
  const recipesResponse: JSENDResponse<RecipeDTO[]> =
    await getAllRecipesForLoggedInUser();

  const hasError = recipesResponse.status !== "success";

  if (hasError) {
    return (
      <Screen title="Recetas">
        {/* TODO: return an styled error message if has error */}
        <span>
          Hubo un error al cargar tus recetas. Por favor, inténtalo de nuevo más
          tarde.
        </span>
      </Screen>
    );
  }

  const recipes = recipesResponse.data;

  return (
    <Screen title="Recetas">
      <RecipesGrid recipes={recipes} />
    </Screen>
  );
}
