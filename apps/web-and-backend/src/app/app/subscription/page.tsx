import PageTitle from "@/app/_ui/typography/PageTitle";

import SubscriptionCard from "../../_features/subscription/SubscriptionCard";
import { getPlanInfo } from "../../_features/subscription/actions";
import { getLoggedInUser } from "../../_features/user/actions";
import PageWrapper from "../../_ui/PageWrapper";
import SectionHeading from "../../_ui/typography/SectionHeading";
import SubscriptionSuccessRedirect from "./SubscriptionSuccessRedirect";

export const metadata = {
  title: "Suscripción",
  description: "Gestiona tu suscripción.",
};

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ subscriptionSuccess?: string }>;
}) {
  const { subscriptionSuccess } = await searchParams;

  const PageTitleComponent = (
    <PageTitle
      className="mb-6"
      title="Suscripción"
      subtitle="Gestiona tu suscripción."
    />
  );

  if (subscriptionSuccess === "true") {
    return (
      <PageWrapper>
        {PageTitleComponent}
        <SubscriptionSuccessRedirect />
      </PageWrapper>
    );
  }

  const [user, planInfoJSEND] = await Promise.all([
    getLoggedInUser(),
    getPlanInfo(),
  ]);

  const hasErrorPlanInfo = planInfoJSEND.status !== "success";

  if (!user || hasErrorPlanInfo) {
    return (
      <PageWrapper>
        {PageTitleComponent}
        <p>No se pudo cargar la información de tu suscripción.</p>
      </PageWrapper>
    );
  }

  const planInfo = planInfoJSEND.data;

  return (
    <PageWrapper>
      {PageTitleComponent}

      <div className="flex max-bp-navbar-mobile:justify-center">
        <SubscriptionCard
          user={user}
          description={planInfo.description}
          priceInEurCents={planInfo.priceInEurCents}
          title={planInfo.title}
        />
      </div>
    </PageWrapper>
  );
}
