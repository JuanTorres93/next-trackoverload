import SubscriptionCard from '@/app/_features/subscription/SubscriptionCard';
import { getLoggedInUser } from '@/app/_features/user/actions';
import { getPlanInfo } from '@/app/_features/subscription/actions';
import PageWrapper from '@/app/_ui/PageWrapper';
import SectionHeading from '@/app/_ui/typography/SectionHeading';

export const metadata = {
  title: 'Suscripción',
  description: 'Gestiona tu suscripción.',
};

export default async function SubscriptionPage() {
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

      <SubscriptionCard
        user={user}
        description={planInfo.description}
        priceInEurCents={planInfo.priceInEurCents}
        title={planInfo.title}
      />
    </PageWrapper>
  );
}
