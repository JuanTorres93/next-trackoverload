import { vi } from 'vitest';

export const TEST_USER_ID = 'dev-user';

vi.mock('next/headers', () => {
  return {
    headers: vi.fn(),
    cookies: vi.fn(() =>
      Promise.resolve({
        get: vi.fn(() => ({ value: 'test-token' })),
      }),
    ),
  };
});

vi.mock('@/app/_utils/auth/getCurrentUserId', () => {
  return {
    getCurrentUserId: vi.fn(() => Promise.resolve(TEST_USER_ID)),
  };
});

export const mockRouterReplace = vi.fn();

vi.mock('next/navigation', () => {
  return {
    redirect: vi.fn(),
    usePathname: vi.fn(() => '/'),
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
      replace: mockRouterReplace,
    })),
  };
});

vi.mock('next/cache', () => {
  return {
    revalidatePath: vi.fn(),
  };
});
