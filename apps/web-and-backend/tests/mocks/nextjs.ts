import { vi } from "vitest";

import { userId } from "../createProps/userTestProps";

export const TEST_USER_ID = userId;

const searchParamsState = vi.hoisted(() => ({ params: new URLSearchParams() }));

export const resetMockSearchParams = () => {
  searchParamsState.params = new URLSearchParams();
};

let currentUserIdForTests: string | null = TEST_USER_ID;

export const setCurrentlyLoggedInUserIdForTests = (id: string | null) => {
  currentUserIdForTests = id;
};

vi.mock("next/headers", () => {
  return {
    headers: vi.fn(),
    cookies: vi.fn(() =>
      Promise.resolve({
        get: vi.fn(() => ({ value: "test-token" })),
      }),
    ),
  };
});

vi.mock("@/app/_utils/auth/getCurrentUserId", () => {
  return {
    getCurrentUserId: vi.fn(() => Promise.resolve(currentUserIdForTests)),
  };
});

export const mockRouterReplace = vi.fn((url: string) => {
  const queryString = url.includes("?") ? url.split("?")[1] : "";
  searchParamsState.params = new URLSearchParams(queryString);
});

vi.mock("next/navigation", () => {
  return {
    redirect: vi.fn(),
    usePathname: vi.fn(() => "/"),
    useSearchParams: vi.fn(() => searchParamsState.params),
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

vi.mock("next/cache", () => {
  return {
    revalidatePath: vi.fn(),
    refresh: vi.fn(),
  };
});
