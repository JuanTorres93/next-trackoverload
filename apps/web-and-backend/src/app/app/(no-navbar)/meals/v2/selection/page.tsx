import DaySelector, {
  SelectedDays,
} from "@/app/_features/meal/redesign/DaySelector";
import Screen from "@/app/_ui/Screen";
import ButtonAction from "@/app/_ui/buttons/ButtonAction";

import DateHeader from "./DateHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Selecciona recetas",
  description: "Selecciona recetas para registrar",
};

export default async function SelectMealsPage() {
  return (
    <Screen title="Selecciona recetas para registrar" hasBackButton>
      <form
        className="grid grid-cols-1 grid-rows-[min-content_min-content_min-content_1fr] gap-6.5 h-full"
        action=""
      >
        <DateHeader />

        <DaySelector />
        <SelectedDays />

        <ButtonAction className="self-end">Seleccionar comidas</ButtonAction>
      </form>
    </Screen>
  );
}
