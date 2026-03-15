import { screen, render } from '@testing-library/react';
import { toUserDTO, UserDTO } from '@/application-layer/dtos/UserDTO';
import SubscriptionCard from '../SubscriptionCard';
import { validUserProps } from '../../../../../tests/createProps/userTestProps';
import { User } from '@/domain/entities/user/User';

const PERIOD_END_DATE = new Date(2026, 3, 12); // 12 April 2026

async function setup(subscriptionStatus?: string, periodEndDate?: Date) {
  const user: UserDTO = toUserDTO(
    User.create({
      ...validUserProps,
      subscriptionStatus,
    }),
  );

  render(
    <SubscriptionCard
      title="Plan Pro"
      priceInEurCents={999}
      description="Accede a todas las funciones premium de la aplicación."
      user={user}
      periodEndDate={periodEndDate}
    />,
  );
}

describe('SubscriptionCard', () => {
  it('always renders the title', async () => {
    await setup();

    const heading = screen.getByRole('heading', { name: 'Plan Pro' });

    expect(heading).toBeInTheDocument();
  });

  describe('no active subscription', () => {
    it.each(['free_trial', 'expired', undefined])(
      'shows description and price for status "%s"',
      async (status) => {
        await setup(status);

        expect(
          screen.getByText(/accede.*todas.*funciones/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/9\.99 €\/mes/)).toBeInTheDocument();
      },
    );

    it('shows subscribe button', async () => {
      await setup();

      expect(
        screen.getByRole('button', { name: /suscribirme/i }),
      ).toBeInTheDocument();
    });

    it('does not show the status badge', async () => {
      await setup();

      expect(screen.queryByText(/^estado:/i)).not.toBeInTheDocument();
    });
  });

  describe('active subscription', () => {
    it('shows active status badge', async () => {
      await setup('active');

      expect(screen.getByTestId('status-badge')).toHaveTextContent(/activa/i);
    });

    it('shows next payment date', async () => {
      await setup('active', PERIOD_END_DATE);

      expect(screen.getByTestId('period-end-date')).toHaveTextContent(
        /próximo pago/i,
      );
      expect(screen.getByTestId('period-end-date')).toHaveTextContent(/12/);
      expect(screen.getByTestId('period-end-date')).toHaveTextContent(/abril/i);
    });

    it('shows manage payment and cancel subscription buttons', async () => {
      await setup('active');

      expect(
        screen.getByRole('button', { name: /gestionar suscripción/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancelar suscripción/i }),
      ).toBeInTheDocument();
    });

    it('does not show the subscribe button', async () => {
      await setup('active');

      expect(
        screen.queryByRole('button', { name: /suscribirme/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('free subscription', () => {
    it('shows free subscription label', async () => {
      await setup('free');

      expect(screen.getByText(/suscripción gratuita/i)).toBeInTheDocument();
    });

    it('does not show the subscribe button', async () => {
      await setup('free');

      expect(
        screen.queryByRole('button', { name: /suscribirme/i }),
      ).not.toBeInTheDocument();
    });

    it('does not show the status badge', async () => {
      await setup('free');

      expect(screen.queryByTestId('status-badge')).not.toBeInTheDocument();
    });
  });

  describe('canceled subscription', () => {
    it('shows canceled status badge', async () => {
      await setup('canceled');

      expect(screen.getByTestId('status-badge')).toHaveTextContent(
        /cancelada/i,
      );
    });

    it('shows active-until date', async () => {
      await setup('canceled', PERIOD_END_DATE);

      expect(screen.getByTestId('period-end-date')).toHaveTextContent(
        /activa hasta/i,
      );
      expect(screen.getByTestId('period-end-date')).toHaveTextContent(/12/);
      expect(screen.getByTestId('period-end-date')).toHaveTextContent(/abril/i);
    });

    it('shows reactivate subscription button', async () => {
      await setup('canceled');

      expect(
        screen.getByRole('button', { name: /reactivar suscripción/i }),
      ).toBeInTheDocument();
    });

    it('does not show the subscribe button', async () => {
      await setup('canceled');

      expect(
        screen.queryByRole('button', { name: /suscribirme/i }),
      ).not.toBeInTheDocument();
    });
  });
});
