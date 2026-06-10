import { JSENDResponse, RecipeDTO } from "shared";

import { getAllRecipesForLoggedInUser } from "@/app/_features/recipe/actions";
import RecipeSelectionForm from "@/app/_features/recipe/redesign/RecipeSelectionForm";
import Screen from "@/app/_ui/screen/Screen";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Selecciona recetas",
  description: "Selecciona recetas para registrar",
};

export default async function SelectMealsPage() {
  const recipesResponse: JSENDResponse<RecipeDTO[]> =
    await getAllRecipesForLoggedInUser();

  const hasError = recipesResponse.status !== "success";

  const recipes =
    recipesResponse.status === "success" ? recipesResponse.data : [];

  return (
    <Screen title="Selecciona recetas para registrar" hasBackButton>
      <RecipeSelectionForm hasError={hasError} recipes={recipes} />
    </Screen>
  );
}
