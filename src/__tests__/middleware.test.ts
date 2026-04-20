// @vitest-environment node
import { NextRequest } from "next/server";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";
import { AppAuthService } from "@/interface-adapters/app/services/AppAuthService";

import { middleware } from "../middleware";

vi.mock("@/interface-adapters/app/services/AppAuthService", () => ({
  AppAuthService: {
    validateToken: vi.fn(),
    getCurrentUserIdFromToken: vi.fn(),
  },
}));

vi.mock("@/interface-adapters/app/repos/AppUsersRepo", () => ({
  AppUsersRepo: {
    getUserById: vi.fn(),
  },
}));

const validateTokenMock = vi.mocked(AppAuthService.validateToken);
const getCurrentUserIdFromTokenMock = vi.mocked(
  AppAuthService.getCurrentUserIdFromToken,
);
const getUserByIdMock = vi.mocked(AppUsersRepo.getUserById);

function makeRequest(pathname: string, token?: string): NextRequest {
  return new NextRequest(`http://localhost${pathname}`, {
    headers: token ? { cookie: `token=${token}` } : {},
  });
}

function getRedirectPathname(response: Response): string | null {
  const location = response.headers.get("location");
  if (!location) return null;
  return new URL(location).pathname;
}

function mockValidUserWithSubscription() {
  getCurrentUserIdFromTokenMock.mockResolvedValue("user-id");
  getUserByIdMock.mockResolvedValue({ hasValidSubscription: true } as Awaited<
    ReturnType<typeof AppUsersRepo.getUserById>
  >);
}

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("routes not allowed for logged-in users (/auth/login, /auth/register)", () => {
    const authPaths = ["/auth/login", "/auth/register"];

    for (const path of authPaths) {
      describe(path, () => {
        it("passes through when there is no session token", async () => {
          const response = await middleware(makeRequest(path));

          expect(getRedirectPathname(response)).toBeNull();
        });

        it("redirects to /app when the session token is valid", async () => {
          validateTokenMock.mockResolvedValue(true);

          const response = await middleware(makeRequest(path, "valid-token"));

          expect(getRedirectPathname(response)).toBe("/app");
        });

        it("passes through when the session token is invalid", async () => {
          validateTokenMock.mockResolvedValue(false);

          const response = await middleware(makeRequest(path, "invalid-token"));

          expect(getRedirectPathname(response)).toBeNull();
        });
      });
    }
  });

  describe("protected app routes (/app/*)", () => {
    it("redirects to /auth/login when there is no session token", async () => {
      const response = await middleware(makeRequest("/app/dashboard"));

      expect(getRedirectPathname(response)).toBe("/auth/login");
    });

    it("passes through when the session token is valid and subscription is active", async () => {
      validateTokenMock.mockResolvedValue(true);
      mockValidUserWithSubscription();

      const response = await middleware(
        makeRequest("/app/dashboard", "valid-token"),
      );

      expect(getRedirectPathname(response)).toBeNull();
    });

    it("redirects to /auth/login when the token is invalid", async () => {
      validateTokenMock.mockResolvedValue(false);

      const response = await middleware(
        makeRequest("/app/dashboard", "invalid-token"),
      );

      expect(getRedirectPathname(response)).toBe("/auth/login");
    });

    it("redirects to /auth/login when validateToken throws", async () => {
      validateTokenMock.mockRejectedValue(new Error("unexpected error"));

      const response = await middleware(makeRequest("/app/dashboard", "token"));

      expect(getRedirectPathname(response)).toBe("/auth/login");
    });

    describe("subscription redirect", () => {
      it("redirects to /app/subscription when user has no valid subscription", async () => {
        validateTokenMock.mockResolvedValue(true);
        getCurrentUserIdFromTokenMock.mockResolvedValue("user-id");
        getUserByIdMock.mockResolvedValue({
          hasValidSubscription: false,
        } as Awaited<ReturnType<typeof AppUsersRepo.getUserById>>);

        const response = await middleware(
          makeRequest("/app/dashboard", "valid-token"),
        );

        expect(getRedirectPathname(response)).toBe("/app/subscription");
      });

      it("does NOT redirect to /app/subscription when already on that path", async () => {
        validateTokenMock.mockResolvedValue(true);

        const response = await middleware(
          makeRequest("/app/subscription", "valid-token"),
        );

        expect(getRedirectPathname(response)).toBeNull();
      });

      it("does NOT redirect when user has a valid subscription", async () => {
        validateTokenMock.mockResolvedValue(true);
        mockValidUserWithSubscription();

        const response = await middleware(
          makeRequest("/app/dashboard", "valid-token"),
        );

        expect(getRedirectPathname(response)).toBeNull();
      });

      it("redirects to /app/subscription when user is not found", async () => {
        validateTokenMock.mockResolvedValue(true);
        getCurrentUserIdFromTokenMock.mockResolvedValue("user-id");
        getUserByIdMock.mockResolvedValue(null);

        const response = await middleware(
          makeRequest("/app/dashboard", "valid-token"),
        );

        expect(getRedirectPathname(response)).toBe("/app/subscription");
      });
    });
  });
});
