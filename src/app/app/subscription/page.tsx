import SubscriptionCard from '@/app/_features/subscription/SubscriptionCard';
import { getLoggedInUser } from '@/app/_features/user/actions';
import PageWrapper from '@/app/_ui/PageWrapper';
import SectionHeading from '@/app/_ui/typography/SectionHeading';

export const metadata = {
  title: 'Suscripción',
  description: 'Gestiona tu suscripción.',
};

export default async function SubscriptionPage() {
  const user = await getLoggedInUser();

  // TODO IMPORTANT get subscription info from stripe

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
        description="Accede a todas las funciones premium de la aplicación."
        priceInEurCents={999}
        title="Plan Pro"
        periodEndDate={new Date()}
      />
    </PageWrapper>
  );
}
