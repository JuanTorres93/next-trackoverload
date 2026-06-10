import { JSENDResponse, RecipeDTO } from "shared";

import TodaysMacros from "@/app/_features/dashboard/TodaysMacros";
import { getAllRecipesForLoggedInUser } from "@/app/_features/recipe/actions";
import Screen from "@/app/_ui/screen/Screen";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recetas",
  description: "Todas tus recetas",
};

export default async function DashboardPage() {
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
    <Screen title="" isDashboard>
      <TodaysMacros
        todaysMacrosProps={{
          totalCalories: 2500,
          totalProtein: 180,
          currentCalories: 1850,
          currentProtein: 145,
        }}
      />
    </Screen>
  );
}
