import UpdateTodaysWeight from "@/app/_features/weight/redesign/UpdateTodaysWeight";
import Screen from "@/app/_ui/screen/Screen";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Progreso de peso",
  description: "Seguimiento de tu progreso de peso",
};

export default async function WeightPage() {
  return (
    <Screen title="Progreso de peso">
      <UpdateTodaysWeight />
    </Screen>
  );
}
