import { JSENDResponse, RecipeDTO } from "shared";

import DaySummary from "@/app/_features/dashboard/DaySummary";
import TodaysMacros from "@/app/_features/dashboard/TodaysMacros";
import TodaysMeals from "@/app/_features/dashboard/TodaysMeals";
import { getAssembledDayById } from "@/app/_features/day/actions";
import { AssembledDayResult } from "@/app/_features/day/actions";
import { getAllRecipesForLoggedInUser } from "@/app/_features/recipe/actions";
import Screen from "@/app/_ui/screen/Screen";
import { dateToDayId } from "@/domain/value-objects/DayId/DayId";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recetas",
  description: "Todas tus recetas",
};

export default async function DashboardPage() {
  const today = new Date();
  const todayId = dateToDayId(today).value;

  const todayAssembledDayJSEND: JSENDResponse<AssembledDayResult> =
    await getAssembledDayById(todayId);
  await getAllRecipesForLoggedInUser();

  const hasError = todayAssembledDayJSEND.status !== "success";

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

  const todayAssembledDay = todayAssembledDayJSEND.data.assembledDay;

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

          <TodaysMeals meals={todayAssembledDay?.meals || []} />
        </div>
      </div>
    </Screen>
  );
}
