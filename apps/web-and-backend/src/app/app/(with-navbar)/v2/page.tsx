import { DayEntry, JSENDResponse } from "shared";

import { handleJSENDResponse } from "@/app/_features/common/handleJSENDResponse";
import DaySummary from "@/app/_features/dashboard/DaySummary";
import TodaysMacros from "@/app/_features/dashboard/TodaysMacros";
import TodaysMeals from "@/app/_features/dashboard/TodaysMeals";
import WeightProgress from "@/app/_features/dashboard/WeightProgress";
import {
  AssembledDayResult,
  getAssembledDayById,
} from "@/app/_features/day/actions";
import { getLastNumberOfDaysIncludingTodayAndNonExistingDays } from "@/app/_features/day/actions";
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

  const promises: [
    Promise<JSENDResponse<AssembledDayResult>>,
    Promise<JSENDResponse<DayEntry[]>>,
  ] = [
    getAssembledDayById(todayId),
    getLastNumberOfDaysIncludingTodayAndNonExistingDays(90),
  ];

  const [todayAssembledDayJSEND, last90DaysJSEND] = await Promise.all(promises);

  // await getAllRecipesForLoggedInUser();

  const handledTodayAssembledDay = handleJSENDResponse(todayAssembledDayJSEND);

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

              <TodaysMeals
                meals={handledTodayAssembledDay.data?.assembledDay?.meals || []}
              />

              <WeightProgress />
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}
