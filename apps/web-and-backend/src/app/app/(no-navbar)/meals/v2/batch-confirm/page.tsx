import { JSENDResponse, RecipeDTO } from "shared";

import { getAllRecipesForLoggedInUser } from "@/app/_features/recipe/actions";
import BatchConfirmForm from "@/app/_features/recipe/redesign/BatchConfirmForm";
import Screen from "@/app/_ui/Screen";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Confirmar y registrar",
  description: "Confirma y registra tus comidas",
};

export default async function BatchLoggingPage() {
  const recipesResponse: JSENDResponse<RecipeDTO[]> =
    await getAllRecipesForLoggedInUser();

  const hasError = recipesResponse.status !== "success";

  const recipes =
    recipesResponse.status === "success" ? recipesResponse.data : [];

  return (
    <Screen title="Confirmar y registrar" hasBackButton>
      <BatchConfirmForm hasError={hasError} recipes={recipes} />
    </Screen>
  );
}
