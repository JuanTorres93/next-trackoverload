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
                  totalCalories: formatToInteger(
                    handledLastDayWithCaloriesGoal.data?.updatedCaloriesGoal ||
                      0,
                  ),
                  totalProtein: formatToInteger(
                    handledLastDayWithProteinGoal.data?.updatedProteinGoal || 0,
                  ),
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
                <RecentRecipes recipes={handledRecipes.data || []} />
              )}
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}
