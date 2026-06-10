import { JSENDResponse, RecipeDTO } from "shared";

import DaySummary from "@/app/_features/dashboard/DaySummary";
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
      <div className="flex flex-col gap-7.5 pb-35">
        <div className="flex flex-col gap-4.5">
          <TodaysMacros
            todaysMacrosProps={{
              totalCalories: 2500,
              totalProtein: 180,
              currentCalories: 1850,
              currentProtein: 145,
            }}
          />

          <DaySummary
            caloriesLeft={650}
            proteinLeft={35}
            mealsToday={3}
            currentWeight={70}
          />
        </div>
      </div>
    </Screen>
  );
}
