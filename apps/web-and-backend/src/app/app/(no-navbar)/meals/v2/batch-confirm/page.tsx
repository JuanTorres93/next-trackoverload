import DaySelector, {
  SelectedDays,
} from "@/app/_features/meal/redesign/DaySelector";
import Screen from "@/app/_ui/Screen";
import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import AppSectionTitle from "@/app/_ui/typography/AppSectionTitle";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Confirmar y registrar",
  description: "Confirma y registra tus comidas",
};

export default async function BatchLoggingPage() {
  return (
    <Screen title="Confirmar y registrar" hasBackButton>
      <form
        className="grid grid-cols-1 grid-rows-[min-content_min-content_min-content_1fr] gap-6.5 h-full"
        action=""
      >
        <AppSectionTitle className="text-[14px]">
          Estás a punto de registrar lo siguiente
        </AppSectionTitle>

        <ButtonAction className="self-end">
          Confirmar y registrar comidas
        </ButtonAction>
      </form>
    </Screen>
  );
}
