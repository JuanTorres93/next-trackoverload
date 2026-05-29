"use client";

import { useEffect, useState } from "react";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HiCalendar } from "react-icons/hi";

import { AssembledDayDTO } from "@/application-layer/dtos/AssembledDayDTO";

import { FakeMealDTO } from "../../application-layer/dtos/FakeMealDTO";
import { MealDTO } from "../../application-layer/dtos/MealDTO";
import { DayEntry } from "../../application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase";
import { dateToDayId } from "../../domain/value-objects/DayId/DayId";
import AddFoodButton from "../_features/common/AddFoodButton";
import EatenFakeMeal from "../_features/fakemeal/EatenFakeMeal";
import EatenMealsNutritionTracker from "../_features/meal/EatenMealsNutritionTracker";
import MealReminder from "../_features/meal/MealReminder";
import WeightTracker from "../_features/weight/WeightTracker";
import ErrorBox from "../_ui/ErrorBox";
import GridAutoCols from "../_ui/GridAutoCols";
import PageWrapper from "../_ui/PageWrapper";
import ButtonPrimary from "../_ui/buttons/ButtonPrimary";
import PageTitle from "../_ui/typography/PageTitle";

export default function Dashboard() {
  const [todayAssembledDay, setTodayAssembledDay] =
    useState<AssembledDayDTO | null>(null);
  const [errorInAssembledDayResult, setErrorInAssembledDayResult] =
    useState(false);

  const [daysHistory, setDaysHistory] = useState<DayEntry[] | null>(null);
  const [errorInDaysHistoryResult, setErrorInDaysHistoryResult] =
    useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  function reloadDashboardData() {
    setReloadToken((current) => current + 1);
  }

  useEffect(() => {
    async function fetchData() {
      const todayId = dateToDayId(new Date()).value;

      const [assembledDayResultJSEND, daysHistoryJSEND] = await Promise.all([
        fetch(`/api/day/assembled/${todayId}`, {
          cache: "no-store",
        }).then((res) => res.json()),

        fetch(`/api/day/last/90`).then((res) => res.json()),
      ]);

      const errorInAssembledDayResult =
        assembledDayResultJSEND.status !== "success";

      const errorInDaysHistoryResult = daysHistoryJSEND.status !== "success";

      setErrorInAssembledDayResult(errorInAssembledDayResult);
      setErrorInDaysHistoryResult(errorInDaysHistoryResult);

      if (!errorInAssembledDayResult) {
        setTodayAssembledDay(assembledDayResultJSEND.data);
      }

      if (!errorInDaysHistoryResult) {
        setDaysHistory(daysHistoryJSEND.data);
      }
    }

    fetchData();
  }, [reloadToken]);

  return (
    <PageWrapper className="flex flex-col max-w-5xl gap-12">
      {errorInAssembledDayResult && (
        <ErrorBox>{"Error al cargar los datos de hoy."}</ErrorBox>
      )}

      {!errorInAssembledDayResult && todayAssembledDay && (
        <NutritionForToday
          assembledDayResult={todayAssembledDay}
          onDataChanged={reloadDashboardData}
        />
      )}

      {errorInDaysHistoryResult && (
        <ErrorBox>{"Error al cargar el historial de días."}</ErrorBox>
      )}

      {!errorInDaysHistoryResult && daysHistory && (
        <WeightManagement daysHistory={daysHistory} />
      )}
    </PageWrapper>
  );
}

function NutritionForToday({
  assembledDayResult,
  onDataChanged,
}: {
  assembledDayResult: AssembledDayDTO;
  onDataChanged: () => void;
}) {
  const mealsForToday: MealDTO[] = assembledDayResult?.meals || [];

  const fakeMealsForToday: FakeMealDTO[] = assembledDayResult?.fakeMeals || [];

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

  // TODO DELETE THESE DEBUG LOGS
  console.log("mealsForToday FROM COMPONENT");
  console.log(mealsForToday);

  return (
    <section className="flex flex-col gap-4">
      <PageTitle title="Tus comidas hoy" subtitle={todayFormatted} />

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
                dayId={assembledDayResult.id}
                onDataChanged={onDataChanged}
              />
            ))}

            {fakeMealsForToday.map((fakeMeal) => (
              <EatenFakeMeal
                key={fakeMeal.id}
                fakeMeal={fakeMeal}
                dayId={assembledDayResult.id}
                onDataChanged={onDataChanged}
              />
            ))}
          </GridAutoCols>

          <AddFoodButton
            dayId={assembledDayResult.id}
            onDataChanged={onDataChanged}
          />
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
      <PageTitle title="Tu peso" />

      <WeightTracker days={daysHistory} />
    </section>
  );
}
