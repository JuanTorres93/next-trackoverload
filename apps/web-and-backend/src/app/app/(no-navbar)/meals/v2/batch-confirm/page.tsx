import BatchConfirmForm from "@/app/_features/recipe/redesign/BatchConfirmForm";
import Screen from "@/app/_ui/Screen";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Confirmar y registrar",
  description: "Confirma y registra tus comidas",
};

export default async function BatchLoggingPage() {
  return (
    <Screen title="Confirmar y registrar" hasBackButton>
      <BatchConfirmForm />
    </Screen>
  );
}
