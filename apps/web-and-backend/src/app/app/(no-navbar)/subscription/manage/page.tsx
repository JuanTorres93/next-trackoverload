import { isFreeTrialExpired } from "@/app/_features/subscription/isFreeTrialExpired";
import FreeTrialCountdown from "@/app/_features/subscription/redesign/FreeTrialCountdown";
import PremiumPlanActiveSubscription from "@/app/_features/subscription/redesign/PremiumPlanActiveSubscription";
import PremiumPlanCard from "@/app/_features/subscription/redesign/PremiumPlanCard";
import { getLoggedInUser } from "@/app/_features/user/actions";
import Screen from "@/app/_ui/Screen";

import CancelSubscriptionMenu from "./CancelSubscriptionMenu";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Suscripción",
};

export default async function ManageSubscriptionPage() {
  const loggedInUser = await getLoggedInUser();

  const hasError = loggedInUser.status !== "success";

  if (hasError || !loggedInUser.data) {
    // TODO IMPORTANT handle error properly
    return null;
  }

  const loggedInUserData = loggedInUser.data;

  const freeTrialExpired = isFreeTrialExpired(loggedInUserData.createdAt);

  function notHasValidSubscriptionOrIsFreeTrialOrFree() {
    return (
      !loggedInUserData.hasValidSubscription ||
      loggedInUserData.subscriptionStatus === "free_trial" ||
      loggedInUserData.subscriptionStatus === "free"
    );
  }

  return (
    <Screen title="Suscripción" hasBackButton>
      <div className="flex flex-col gap-5">
        {!freeTrialExpired && <FreeTrialCountdown />}

        {notHasValidSubscriptionOrIsFreeTrialOrFree() && <PremiumPlanCard />}

        {loggedInUserData.hasValidSubscription && (
          <PremiumPlanActiveSubscription />
        )}
      </div>

      <CancelSubscriptionMenu show={false} />
    </Screen>
  );
}
