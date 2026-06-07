import { JSENDResponse } from "shared";

import {
  AssembledDayResult,
  getAssembledDayById,
} from "@/app/_features/day/actions";
import Meal from "@/app/_features/meal/redesign/Meal";
import Screen from "@/app/_ui/Screen";
import { dateToDayId } from "@/domain/value-objects/DayId/DayId";

import DateHeader from "./DateHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recetas",
  description: "Todas tus recetas",
};

export default async function RecipesPage() {
  const today = new Date();
  const todayId = dateToDayId(today).value;

  const todayAssembledDay: JSENDResponse<AssembledDayResult> =
    await getAssembledDayById(todayId);

  const hasError = todayAssembledDay.status !== "success";

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

  const todayAssembledDayData = todayAssembledDay.data;

  if (!todayAssembledDayData) {
    // TODO IMPORTANT: better handling
    return (
      <Screen title="Recetas">
        <span>No se encontró el día de hoy.</span>
      </Screen>
    );
  }

  const meals = todayAssembledDayData.assembledDay?.meals || [];

  return (
    <Screen title="Comidas">
      <DateHeader />

      {meals.map((meal) => (
        <Meal key={meal.id} meal={meal} />
      ))}
    </Screen>
  );
}
