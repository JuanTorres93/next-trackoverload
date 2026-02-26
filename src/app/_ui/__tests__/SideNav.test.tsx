import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';
import SideNav, { NavBar } from '../SideNav';

beforeEach(() => {
  // Simulate a desktop viewport so useScreenResize sets navbarShown = true
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1920,
  });
  document.documentElement.style.setProperty(
    '--breakpoint-bp-navbar-mobile',
    '768',
  );
});

async function setup() {
  render(
    <SideNav>
      <NavBar />
    </SideNav>,
  );

  const logoutButton = screen.getByTestId('logout-button');

  return { logoutButton };
}

describe('SideNav', () => {
  it('should call logout endpoint', async () => {
    const { logoutButton } = await setup();

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    await userEvent.click(logoutButton);

    expect(fetchSpy).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST',
    });

    fetchSpy.mockRestore();
  });
});
