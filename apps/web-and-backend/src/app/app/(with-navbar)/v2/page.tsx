import { DayDTO, DayEntry, JSENDResponse, RecipeDTO } from "shared";

import { handleJSENDResponse } from "@/app/_features/common/handleJSENDResponse";
import DaySummary from "@/app/_features/dashboard/DaySummary";
import RecentRecipes from "@/app/_features/dashboard/RecentRecipes";
import TodaysMacros from "@/app/_features/dashboard/TodaysMacros";
import TodaysMeals from "@/app/_features/dashboard/TodaysMeals";
import WeightProgress from "@/app/_features/dashboard/WeightProgress";
import {
  AssembledDayResult,
  getAssembledDayById,
  getLastDayWithCaloriesGoalForUser,
  getLastDayWithProteinGoalForUser,
  getLastNumberOfDaysIncludingTodayAndNonExistingDays,
} from "@/app/_features/day/actions";
import { getTodayDayId } from "@/app/_features/day/utils/getTodayDayId";
import { getAllRecipesForLoggedInUser } from "@/app/_features/recipe/actions";
import Screen from "@/app/_ui/screen/Screen";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recetas",
  description: "Todas tus recetas",
};

export default async function DashboardPage() {
  const todayId = getTodayDayId();

  const promises: [
    Promise<JSENDResponse<AssembledDayResult>>,
    Promise<JSENDResponse<DayEntry[]>>,
    Promise<JSENDResponse<RecipeDTO[]>>,
    Promise<JSENDResponse<DayDTO | null>>,
    Promise<JSENDResponse<DayDTO | null>>,
  ] = [
    getAssembledDayById(todayId),
    getLastNumberOfDaysIncludingTodayAndNonExistingDays(90),
    getAllRecipesForLoggedInUser(),
    getLastDayWithCaloriesGoalForUser(),
    getLastDayWithProteinGoalForUser(),
  ];

  const [
    todayResponse,
    last90DaysResponse,
    recipesResponse,
    lastDayWithCaloriesGoalResponse,
    lastDayWithProteinGoalResponse,
  ] = await Promise.all(promises);

  const handledTodayAssembledDay = handleJSENDResponse(todayResponse);
  const handledLast90Days = handleJSENDResponse(last90DaysResponse);
  const handledRecipes = handleJSENDResponse(recipesResponse);
  const handledLastDayWithCaloriesGoal = handleJSENDResponse(
    lastDayWithCaloriesGoalResponse,
  );
  const handledLastDayWithProteinGoal = handleJSENDResponse(
    lastDayWithProteinGoalResponse,
  );

  const last90Days = handledLast90Days.isSuccess ? handledLast90Days.data : [];
  const last30Days = last90Days!.slice(-30);
  const last14Days = last90Days!.slice(-14);

  const totalCalories = formatToInteger(
    handledLastDayWithCaloriesGoal.data?.updatedCaloriesGoal || 0,
  );
  const totalProtein = formatToInteger(
    handledLastDayWithProteinGoal.data?.updatedProteinGoal || 0,
  );
  const mealsTodayCount =
    (handledTodayAssembledDay.data?.assembledDay?.meals.length || 0) +
    (handledTodayAssembledDay.data?.assembledDay?.fakeMeals.length || 0);

  const weight = handledTodayAssembledDay.data?.assembledDay?.userWeightInKg;

  const caloriesToday =
    (handledTodayAssembledDay.data?.assembledDay?.meals.reduce(
      (acc, meal) => acc + meal.calories,
      0,
    ) || 0) +
    (handledTodayAssembledDay.data?.assembledDay?.fakeMeals.reduce(
      (acc, meal) => acc + meal.calories,
      0,
    ) || 0);
  const proteinToday =
    (handledTodayAssembledDay.data?.assembledDay?.meals.reduce(
      (acc, meal) => acc + meal.protein,
      0,
    ) || 0) +
    (handledTodayAssembledDay.data?.assembledDay?.fakeMeals.reduce(
      (acc, meal) => acc + meal.protein,
      0,
    ) || 0);

  const caloriesLeft = formatToInteger(totalCalories - (caloriesToday || 0));
  const proteinLeft = formatToInteger(totalProtein - (proteinToday || 0));

  const recentRecipes = handledRecipes.isSuccess
    ? handledRecipes.data?.slice(0, 3)
    : [];

  return (
    <Screen title="" isDashboard>
      <div className="flex flex-col gap-7.5 pb-35">
        <div className="flex flex-col gap-4.5">
          {!handledTodayAssembledDay.isSuccess &&
            handledTodayAssembledDay.errorComponent}

          {handledTodayAssembledDay.isSuccess && (
            <>
              <TodaysMacros
                todaysMacrosProps={{
                  totalCalories,
                  totalProtein,
                  currentCalories: caloriesToday || 0,
                  currentProtein: proteinToday || 0,
                }}
              />

              <DaySummary
                caloriesLeft={caloriesLeft}
                proteinLeft={proteinLeft}
                mealsToday={mealsTodayCount}
                currentWeight={weight}
              />

              <TodaysMeals
                meals={handledTodayAssembledDay.data?.assembledDay?.meals || []}
              />

              {!handledLast90Days.isSuccess && handledLast90Days.errorComponent}

              {handledLast90Days.isSuccess && (
                <WeightProgress
                  daysShortTerm={last14Days}
                  daysMediumTerm={last30Days}
                  daysLongTerm={handledLast90Days.data || []}
                />
              )}

              {!handledRecipes.isSuccess && handledRecipes.errorComponent}
              {handledRecipes.isSuccess && (
                <RecentRecipes recipes={recentRecipes || []} />
              )}
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}
