import { describe, it, expect, beforeEach } from 'vitest';
import { JwtAuthService } from '../JwtAuthService';

const TEST_SECRET = 'test-secret-do-not-use-in-production';

describe('JwtAuthService', () => {
  let authService: JwtAuthService;

  beforeEach(() => {
    authService = new JwtAuthService(TEST_SECRET);
  });

  describe('generateToken', () => {
    it('should generate a token for a given userId', () => {
      const token = authService.generateToken('user-123');

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate a JWT-shaped token (three dot-separated parts)', () => {
      const token = authService.generateToken('user-123');
      const parts = token.split('.');

      expect(parts).toHaveLength(3);
    });

    it('should generate different tokens for different userIds', () => {
      const token1 = authService.generateToken('user-123');
      const token2 = authService.generateToken('user-456');

      expect(token1).not.toBe(token2);
    });
  });

  describe('validateToken', () => {
    it('should validate a valid token', () => {
      const token = authService.generateToken('user-123');

      expect(authService.validateToken(token)).toBe(true);
    });

    it('should invalidate a malformed token', () => {
      expect(authService.validateToken('not-a-jwt')).toBe(false);
    });

    it('should invalidate an empty token', () => {
      expect(authService.validateToken('')).toBe(false);
    });

    it('should invalidate a token signed with a different secret', () => {
      const otherService = new JwtAuthService('other-secret');
      const token = otherService.generateToken('user-123');

      expect(authService.validateToken(token)).toBe(false);
    });

    it('should invalidate an expired token', async () => {
      const shortLivedService = new JwtAuthService(TEST_SECRET, 1); // 1 second
      const token = shortLivedService.generateToken('user-123');

      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(shortLivedService.validateToken(token)).toBe(false);
    });
  });

  describe('getCurrentUserIdFromToken', () => {
    it('should extract userId from a valid token', () => {
      const userId = 'user-123';
      const token = authService.generateToken(userId);

      expect(authService.getCurrentUserIdFromToken(token)).toBe(userId);
    });

    it('should throw for a malformed token', () => {
      expect(() => authService.getCurrentUserIdFromToken('invalid')).toThrow();
    });

    it('should throw for a token signed with a different secret', () => {
      const otherService = new JwtAuthService('other-secret');
      const token = otherService.generateToken('user-123');

      expect(() => authService.getCurrentUserIdFromToken(token)).toThrow();
    });
  });
});
