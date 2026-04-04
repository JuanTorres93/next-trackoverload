import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HiCalendar } from "react-icons/hi";

import { FakeMealDTO } from "@/application-layer/dtos/FakeMealDTO";
import { MealDTO } from "@/application-layer/dtos/MealDTO";
import { DayEntry } from "@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase";
import { dateToDayId } from "@/domain/value-objects/DayId/DayId";

import AddFoodButton from "../_features/common/AddFoodButton";
import {
  AssembledDayResult,
  getAssembledDayById,
  getLastNumberOfDaysIncludingToday,
} from "../_features/day/actions";
import EatenFakeMeal from "../_features/fakemeal/EatenFakeMeal";
import EatenMealsNutritionTracker from "../_features/meal/EatenMealsNutritionTracker";
import MealReminder from "../_features/meal/MealReminder";
import WeightTracker from "../_features/weight/WeightTracker";
import GridAutoCols from "../_ui/GridAutoCols";
import PageWrapper from "../_ui/PageWrapper";
import ButtonPrimary from "../_ui/buttons/ButtonPrimary";

export default async function Dashboard() {
  const todayId = dateToDayId(new Date());

  const promises = [
    getAssembledDayById(todayId.value),
    getLastNumberOfDaysIncludingToday(90),
  ] as const;
  const [assembledDayResult, daysHistory] = await Promise.all(promises);

  return (
    <PageWrapper className="flex flex-col max-w-5xl gap-12">
      <NutritionForToday assembledDayResult={assembledDayResult} />

      <WeightManagement daysHistory={daysHistory} />
    </PageWrapper>
  );
}

function NutritionForToday({
  assembledDayResult,
}: {
  assembledDayResult: AssembledDayResult;
}) {
  const mealsForToday: MealDTO[] = assembledDayResult.assembledDay?.meals || [];

  const fakeMealsForToday: FakeMealDTO[] =
    assembledDayResult.assembledDay?.fakeMeals || [];

  const todayHasMeals = [...mealsForToday, ...fakeMealsForToday].length > 0;

  const todayFormatted = format(new Date(), "EEEE, d 'de' MMMM", {
    locale: es,
  });

  // Sort by isEaten last
  mealsForToday.sort((a, b) => {
    if (a.isEaten === b.isEaten) return 0;
    if (a.isEaten) return 1;
    return -1;
  });

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text">Tus comidas hoy</h1>
        <p className="text-sm capitalize text-text-minor-emphasis">
          {todayFormatted}
        </p>
      </div>

      {todayHasMeals && (
        <>
          <EatenMealsNutritionTracker
            meals={mealsForToday}
            fakeMeals={fakeMealsForToday}
          />

          <GridAutoCols
            className="gap-3"
            fitOrFill="fill"
            min="18rem"
            max="1fr"
          >
            {mealsForToday.map((meal) => (
              <MealReminder
                key={meal.id}
                meal={meal}
                dayId={assembledDayResult.assembledDay!.id}
              />
            ))}

            {fakeMealsForToday.map((fakeMeal) => (
              <EatenFakeMeal
                key={fakeMeal.id}
                fakeMeal={fakeMeal}
                dayId={assembledDayResult.assembledDay!.id}
              />
            ))}
          </GridAutoCols>

          <AddFoodButton dayId={assembledDayResult.assembledDay!.id} />
        </>
      )}

      {!todayHasMeals && (
        <div className="flex flex-col items-center gap-4 border border-dashed py-14 border-border/40 rounded-2xl text-text-minor-emphasis">
          <HiCalendar className="text-4xl opacity-30" />

          <div className="text-center">
            <p className="font-semibold">
              No hay comidas planificadas para hoy
            </p>

            <p className="mt-1 text-sm opacity-60">
              Planifica tus comidas en el planificador semanal
            </p>
          </div>

          <ButtonPrimary href="/app/meals">Ver planificador</ButtonPrimary>
        </div>
      )}
    </section>
  );
}

function WeightManagement({ daysHistory }: { daysHistory: DayEntry[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-text">Tu peso</h2>

      <WeightTracker days={daysHistory} />
    </section>
  );
}

export const metadata = {
  title: "Dashboard",
  description: "Cimientos dashboard",
};
