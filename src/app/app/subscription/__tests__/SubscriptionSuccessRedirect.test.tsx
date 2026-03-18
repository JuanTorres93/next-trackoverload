import { render, screen } from '@testing-library/react';
import { mockRouterReplace } from '@/../tests/mocks/nextjs';
import SubscriptionSuccessRedirect from '../SubscriptionSuccessRedirect';

describe('SubscriptionSuccessRedirect', () => {
  it('renders a spinner while waiting', () => {
    render(<SubscriptionSuccessRedirect />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('does not redirect before 1 second', () => {
    vi.useFakeTimers();

    render(<SubscriptionSuccessRedirect />);

    vi.advanceTimersByTime(999);

    expect(mockRouterReplace).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('redirects to /app/subscription without flag after 1 second', async () => {
    vi.useFakeTimers();

    render(<SubscriptionSuccessRedirect />);

    await vi.advanceTimersByTimeAsync(1000);

    expect(mockRouterReplace).toHaveBeenCalledWith('/app/subscription');

    vi.useRealTimers();
  });
});
