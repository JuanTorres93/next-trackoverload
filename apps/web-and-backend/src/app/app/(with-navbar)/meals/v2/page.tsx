import { JSENDResponse } from "shared";

import {
  AssembledDayResult,
  getAssembledDayById,
} from "@/app/_features/day/actions";
import { getTodayDayId } from "@/app/_features/day/utils/getTodayDayId";
import MealsGrid from "@/app/_features/meal/redesign/MealsGrid";
import ButtonPlus from "@/app/_ui/buttons/ButtonPlus";
import Screen from "@/app/_ui/screen/Screen";

import DateHeader from "./DateHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Recetas",
  description: "Todas tus recetas",
};

export default async function RecipesPage() {
  const todayId = getTodayDayId();

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
    <Screen title="Comidas" screenMenuOpener={<ButtonPlus />}>
      <DateHeader />

      <MealsGrid meals={meals} />
    </Screen>
  );
}
