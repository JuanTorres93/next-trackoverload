import SubscriptionCard from '../../_features/subscription/SubscriptionCard';
import { getLoggedInUser } from '../../_features/user/actions';
import { getPlanInfo } from '../../_features/subscription/actions';
import PageWrapper from '../../_ui/PageWrapper';
import SectionHeading from '../../_ui/typography/SectionHeading';
import SubscriptionSuccessRedirect from './SubscriptionSuccessRedirect';

export const metadata = {
  title: 'Suscripción',
  description: 'Gestiona tu suscripción.',
};

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ subscriptionSuccess?: string }>;
}) {
  const { subscriptionSuccess } = await searchParams;

  if (subscriptionSuccess === 'true') {
    return (
      <PageWrapper>
        <SectionHeading>Suscripción</SectionHeading>
        <SubscriptionSuccessRedirect />
      </PageWrapper>
    );
  }

  const [user, planInfo] = await Promise.all([
    getLoggedInUser(),
    getPlanInfo(),
  ]);

  if (!user) {
    return (
      <PageWrapper>
        <SectionHeading>Suscripción</SectionHeading>
        <p>No se pudo cargar la información de tu suscripción.</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <SectionHeading>Suscripción</SectionHeading>

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
