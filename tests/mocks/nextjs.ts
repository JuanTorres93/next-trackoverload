import { vi } from 'vitest';

export const TEST_USER_ID = 'dev-user';

vi.mock('next/headers', () => {
  return {
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
      replace: vi.fn(),
    })),
  };
});

vi.mock('next/cache', () => {
  return {
    revalidatePath: vi.fn(),
  };
});
