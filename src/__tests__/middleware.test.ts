// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

vi.mock('@/interface-adapters/app/services/AppAuthService', () => ({
  AppAuthService: {
    validateToken: vi.fn(),
  },
}));

import { middleware } from '../middleware';
import { AppAuthService } from '@/interface-adapters/app/services/AppAuthService';

const validateTokenMock = vi.mocked(AppAuthService.validateToken);

function makeRequest(pathname: string, token?: string): NextRequest {
  return new NextRequest(`http://localhost${pathname}`, {
    headers: token ? { cookie: `token=${token}` } : {},
  });
}

function getRedirectPathname(response: Response): string | null {
  const location = response.headers.get('location');
  if (!location) return null;
  return new URL(location).pathname;
}

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('routes not allowed for logged-in users (/auth/login, /auth/register)', () => {
    const authPaths = ['/auth/login', '/auth/register'];

    for (const path of authPaths) {
      describe(path, () => {
        it('passes through when there is no session token', async () => {
          const response = await middleware(makeRequest(path));

          expect(getRedirectPathname(response)).toBeNull();
        });

        it('redirects to /app when the session token is valid', async () => {
          validateTokenMock.mockResolvedValue(true);

          const response = await middleware(makeRequest(path, 'valid-token'));

          expect(getRedirectPathname(response)).toBe('/app');
        });

        it('passes through when the session token is invalid', async () => {
          validateTokenMock.mockResolvedValue(false);

          const response = await middleware(makeRequest(path, 'invalid-token'));

          expect(getRedirectPathname(response)).toBeNull();
        });
      });
    }
  });

  describe('protected app routes (/app/*)', () => {
    it('redirects to /auth/login when there is no session token', async () => {
      const response = await middleware(makeRequest('/app/dashboard'));

      expect(getRedirectPathname(response)).toBe('/auth/login');
    });

    it('passes through when the session token is valid', async () => {
      validateTokenMock.mockResolvedValue(true);

      const response = await middleware(
        makeRequest('/app/dashboard', 'valid-token'),
      );

      expect(getRedirectPathname(response)).toBeNull();
    });

    it('forwards the current pathname in the x-pathname request header', async () => {
      validateTokenMock.mockResolvedValue(true);
      const nextSpy = vi.spyOn(NextResponse, 'next');

      await middleware(makeRequest('/app/dashboard', 'valid-token'));

      const [options] = nextSpy.mock.calls[0];
      expect(options?.request?.headers?.get('x-pathname')).toBe(
        '/app/dashboard',
      );
    });

    it('redirects to /auth/login when the token is invalid', async () => {
      validateTokenMock.mockResolvedValue(false);

      const response = await middleware(
        makeRequest('/app/dashboard', 'invalid-token'),
      );

      expect(getRedirectPathname(response)).toBe('/auth/login');
    });

    it('redirects to /auth/login when validateToken throws', async () => {
      validateTokenMock.mockRejectedValue(new Error('unexpected error'));

      const response = await middleware(makeRequest('/app/dashboard', 'token'));

      expect(getRedirectPathname(response)).toBe('/auth/login');
    });
  });
});
