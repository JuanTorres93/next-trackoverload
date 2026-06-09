import PremiumPlanCard from "@/app/_features/subscription/redesign/PremiumPlanCard";
import Screen from "@/app/_ui/Screen";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Suscripción",
};

export default async function SelectMealsPage() {
  return (
    <Screen title="Suscripción" hasBackButton>
      <PremiumPlanCard />
    </Screen>
  );
}
