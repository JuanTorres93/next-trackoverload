import DaySelector, {
  DaySelectorProvider,
  SelectedDays,
} from "@/app/_features/meal/redesign/DaySelector";
import Screen from "@/app/_ui/Screen";
import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import AppSectionTitle from "@/app/_ui/typography/AppSectionTitle";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Crear Receta",
  description: "Crea una nueva receta",
};

export default async function BatchLoggingPage() {
  return (
    <Screen title="Crear Receta" hasBackButton>
      <form
        className="grid grid-cols-1 grid-rows-[min-content_min-content_min-content_1fr] gap-6.5 h-full"
        action=""
      >
        <AppSectionTitle>Selecciona un rango de fechas</AppSectionTitle>

        <DaySelectorProvider>
          <DaySelector />
          <SelectedDays />
        </DaySelectorProvider>

        <ButtonAction className="self-end">Seleccionar comidas</ButtonAction>
      </form>
    </Screen>
  );
}
