import { vi } from 'vitest';

vi.mock('next/navigation', () => {
  return {
    redirect: vi.fn(),
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
