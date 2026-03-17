import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { toUserDTO, UserDTO } from '@/application-layer/dtos/UserDTO';
import SubscriptionCard from '../SubscriptionCard';
import { validUserProps } from '../../../../../tests/createProps/userTestProps';
import { User } from '@/domain/entities/user/User';

const PERIOD_END_DATE = new Date(2026, 3, 12); // 12 April 2026

async function setup(
  subscriptionStatus?: string,
  subscriptionEndsAt?: Date,
  createdAt?: Date,
) {
  const user: UserDTO = toUserDTO(
    User.create({
      ...validUserProps,
      subscriptionStatus,
      subscriptionEndsAt,
      createdAt: createdAt ?? validUserProps.createdAt,
    }),
  );

  render(
    <SubscriptionCard
      title="Plan Pro"
      priceInEurCents={999}
      description="Accede a todas las funciones premium de la aplicación."
      user={user}
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
    it.each(['expired', undefined])(
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

    it('shows manage cancel subscription buttons', async () => {
      await setup('active');

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

  describe('free_trial subscription', () => {
    describe('within trial period', () => {
      it('shows description and subscribe button', async () => {
        await setup('free_trial');

        expect(
          screen.getByText(/accede.*todas.*funciones/i),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: /suscribirme/i }),
        ).toBeInTheDocument();
      });

      it('does not show the expired trial message', async () => {
        await setup('free_trial');

        expect(
          screen.queryByTestId('expired-trial-message'),
        ).not.toBeInTheDocument();
      });
    });

    describe('trial expired', () => {
      const expiredDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);

      it('shows expired trial message', async () => {
        await setup('free_trial', undefined, expiredDate);

        expect(screen.getByTestId('expired-trial-message')).toHaveTextContent(
          /periodo de prueba ha terminado/i,
        );
      });

      it('shows description and price', async () => {
        await setup('free_trial', undefined, expiredDate);

        expect(
          screen.getByText(/accede.*todas.*funciones/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/9\.99 €\/mes/)).toBeInTheDocument();
      });

      it('shows subscribe button', async () => {
        await setup('free_trial', undefined, expiredDate);

        expect(
          screen.getByRole('button', { name: /suscribirme/i }),
        ).toBeInTheDocument();
      });
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

  describe('subscribe button click', () => {
    const REDIRECT_URL = 'https://checkout.stripe.com/session_123';

    beforeEach(() => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            status: 'success',
            data: { redirectUrl: REDIRECT_URL },
          }),
      });
      vi.stubGlobal('fetch', mockFetch);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('calls POST /api/subscription/create when subscribe button is clicked', async () => {
      await setup();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /suscribirme/i }));

      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/subscription/create',
        { method: 'POST' },
      );
    });

    it('redirects to the returned URL on success', async () => {
      const assignMock = vi.fn();
      vi.stubGlobal('location', { assign: assignMock });

      await setup();
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /suscribirme/i }));

      expect(assignMock).toHaveBeenCalledWith(REDIRECT_URL);
    });
  });

  describe('reactivate button click', () => {
    const REDIRECT_URL = 'https://billing.stripe.com/session_456';

    beforeEach(() => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            status: 'success',
            data: { redirectUrl: REDIRECT_URL },
          }),
      });
      vi.stubGlobal('fetch', mockFetch);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('calls POST /api/subscription/resume when reactivate button is clicked', async () => {
      await setup('canceled');
      const user = userEvent.setup();

      await user.click(
        screen.getByRole('button', { name: /reactivar suscripción/i }),
      );

      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/subscription/resume',
        { method: 'POST' },
      );
    });

    it('redirects to the returned URL on success', async () => {
      const assignMock = vi.fn();
      vi.stubGlobal('location', { assign: assignMock });

      await setup('canceled');
      const user = userEvent.setup();

      await user.click(
        screen.getByRole('button', { name: /reactivar suscripción/i }),
      );

      expect(assignMock).toHaveBeenCalledWith(REDIRECT_URL);
    });
  });

  describe('cancel button click', () => {
    const REDIRECT_URL = 'https://billing.stripe.com/session_123';

    beforeEach(() => {
      const mockFetch = vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            status: 'success',
            data: { redirectUrl: REDIRECT_URL },
          }),
      });
      vi.stubGlobal('fetch', mockFetch);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('calls POST /api/subscription/cancel when cancel button is clicked', async () => {
      await setup('active');
      const user = userEvent.setup();

      await user.click(
        screen.getByRole('button', { name: /cancelar suscripción/i }),
      );

      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/subscription/cancel',
        { method: 'POST' },
      );
    });

    it('redirects to the returned URL on success', async () => {
      const assignMock = vi.fn();
      vi.stubGlobal('location', { assign: assignMock });

      await setup('active');
      const user = userEvent.setup();

      await user.click(
        screen.getByRole('button', { name: /cancelar suscripción/i }),
      );

      expect(assignMock).toHaveBeenCalledWith(REDIRECT_URL);
    });
  });
});
