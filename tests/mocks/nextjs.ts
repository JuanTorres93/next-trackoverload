import { vi } from 'vitest';

vi.mock('next/navigation', () => {
  return {
    redirect: vi.fn(),
  };
});

vi.mock('next/cache', () => {
  return {
    revalidatePath: vi.fn(),
  };
});
