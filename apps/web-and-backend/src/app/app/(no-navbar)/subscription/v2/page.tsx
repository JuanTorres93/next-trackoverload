import FreeTrialCountdown from "@/app/_features/subscription/redesign/FreeTrialCountdown";
import PremiumPlanCard from "@/app/_features/subscription/redesign/PremiumPlanCard";
import Screen from "@/app/_ui/Screen";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Suscripción",
};

export default async function SelectMealsPage() {
  return (
    <Screen title="Suscripción" hasBackButton>
      <div className="flex flex-col gap-5">
        <FreeTrialCountdown />

        <PremiumPlanCard />
      </div>
    </Screen>
  );
}
