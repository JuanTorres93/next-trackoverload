import { render } from '@testing-library/react';
import { vi, expect, describe, it, beforeEach } from 'vitest';
import { redirect } from 'next/navigation';

import { headers } from 'next/headers';
import { getLoggedInUser } from '@/app/_features/user/actions';
import SidebarLayout from '../layout';
import { FREE_TRIAL_DAYS } from '@/domain/common/constants';
import { User } from '@/domain/entities/user/User';
import { toUserDTO } from '@/application-layer/dtos/UserDTO';
import { validUserProps } from '../../../../tests/createProps/userTestProps';

vi.mock('@/app/_features/user/actions', () => ({
  getLoggedInUser: vi.fn(),
}));

vi.mock('@/app/_ui/SideNav', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <nav>{children}</nav>
  ),
  NavBar: () => <div />,
  ToggleButton: () => <div />,
}));
const headersMock = vi.mocked(headers);
const getLoggedInUserMock = vi.mocked(getLoggedInUser);
const redirectMock = vi.mocked(redirect);

function mockPathname(pathname: string) {
  headersMock.mockResolvedValue({
    get: (name: string) => (name === 'x-pathname' ? pathname : null),
  } as ReturnType<(typeof import('next/headers'))['headers']> extends Promise<
    infer T
  >
    ? T
    : never);
}

function mockUser(
  overrides: {
    subscriptionStatus?: string;
    subscriptionEndsAt?: string;
    createdAt?: string;
  } = {},
) {
  const user = User.create({
    ...validUserProps,
    subscriptionStatus: overrides.subscriptionStatus,

    subscriptionEndsAt: overrides.subscriptionEndsAt
      ? new Date(overrides.subscriptionEndsAt)
      : undefined,

    createdAt: overrides.createdAt ? new Date(overrides.createdAt) : undefined,
  });
  getLoggedInUserMock.mockResolvedValue(toUserDTO(user));
}

async function renderLayout() {
  const ui = await SidebarLayout({ children: <div>content</div> });
  render(ui);
}

describe('SidebarLayout – subscription redirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when on /app/subscription', () => {
    it('never redirects regardless of subscription status', async () => {
      mockPathname('/app/subscription');
      // getLoggedInUser should not be called at all
      await renderLayout();

      expect(getLoggedInUserMock).not.toHaveBeenCalled();
      expect(redirectMock).not.toHaveBeenCalled();
    });
  });

  describe('when on any other /app route', () => {
    beforeEach(() => {
      mockPathname('/app/dashboard');
    });

    it('redirects to /app/subscription when the user has no subscription', async () => {
      mockUser({ subscriptionStatus: undefined });

      await renderLayout();

      expect(redirectMock).toHaveBeenCalledWith('/app/subscription');
    });

    it('redirects to /app/subscription when subscriptionStatus is expired', async () => {
      mockUser({ subscriptionStatus: 'expired' });

      await renderLayout();

      expect(redirectMock).toHaveBeenCalledWith('/app/subscription');
    });

    it('redirects when canceled subscription has already ended', async () => {
      const pastDate = new Date(Date.now() - 1000).toISOString();
      mockUser({
        subscriptionStatus: 'canceled',
        subscriptionEndsAt: pastDate,
      });

      await renderLayout();

      expect(redirectMock).toHaveBeenCalledWith('/app/subscription');
    });

    it('redirects when canceled but subscriptionEndsAt is missing', async () => {
      mockUser({
        subscriptionStatus: 'canceled',
        subscriptionEndsAt: undefined,
      });

      await renderLayout();

      expect(redirectMock).toHaveBeenCalledWith('/app/subscription');
    });

    it('does NOT redirect to /app/subscription when subscriptionStatus is free', async () => {
      mockUser({ subscriptionStatus: 'free' });

      await renderLayout();

      expect(redirectMock).not.toHaveBeenCalled();
    });

    it('does NOT redirect when subscription is active', async () => {
      mockUser({ subscriptionStatus: 'active' });

      await renderLayout();

      expect(redirectMock).not.toHaveBeenCalled();
    });

    it('does NOT redirect when subscription is free_trial and within trial period', async () => {
      const recentDate = new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000,
      ).toISOString(); // 1 day ago
      mockUser({
        subscriptionStatus: 'free_trial',
        createdAt: recentDate,
      });

      await renderLayout();

      expect(redirectMock).not.toHaveBeenCalled();
    });

    it('redirects when subscription is free_trial and trial period has expired', async () => {
      const expiredDate = new Date(
        Date.now() - (FREE_TRIAL_DAYS + 1) * 24 * 60 * 60 * 1000,
      ).toISOString();
      mockUser({
        subscriptionStatus: 'free_trial',
        createdAt: expiredDate,
      });

      await renderLayout();

      expect(redirectMock).toHaveBeenCalledWith('/app/subscription');
    });

    it('does NOT redirect when canceled but subscriptionEndsAt is in the future', async () => {
      const futureDate = new Date(Date.now() + 60_000).toISOString();
      mockUser({
        subscriptionStatus: 'canceled',
        subscriptionEndsAt: futureDate,
      });

      await renderLayout();

      expect(redirectMock).not.toHaveBeenCalled();
    });
  });
});
