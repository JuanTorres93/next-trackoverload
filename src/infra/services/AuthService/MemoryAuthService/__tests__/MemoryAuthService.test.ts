import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryAuthService } from '../MemoryAuthService';

describe('MemoryAuthService', () => {
  let authService: MemoryAuthService;

  beforeEach(() => {
    authService = new MemoryAuthService();
  });

  describe('generateToken', () => {
    it('should generate a token for a given userId', () => {
      const userId = 'user-123';
      const token = authService.generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate different tokens for the same userId at different times', () => {
      const userId = 'user-123';
      const token1 = authService.generateToken(userId);
      const token2 = authService.generateToken(userId);

      expect(token1).not.toBe(token2);
    });

    it('should generate different tokens for different userIds', () => {
      const token1 = authService.generateToken('user-123');
      const token2 = authService.generateToken('user-456');

      expect(token1).not.toBe(token2);
    });
  });

  describe('validateToken', () => {
    it('should validate a valid token', () => {
      const userId = 'user-123';
      const token = authService.generateToken(userId);
      const isValid = authService.validateToken(token);

      expect(isValid).toBe(true);
    });

    it('should invalidate a malformed token', () => {
      const isValid = authService.validateToken('invalid-token');

      expect(isValid).toBe(false);
    });

    it('should invalidate an empty token', () => {
      const isValid = authService.validateToken('');

      expect(isValid).toBe(false);
    });

    it('should invalidate a revoked token', () => {
      const userId = 'user-123';
      const token = authService.generateToken(userId);

      authService.revokeToken(token);
      const isValid = authService.validateToken(token);

      expect(isValid).toBe(false);
    });
  });

  describe('revokeToken', () => {
    it('should revoke a token', () => {
      const userId = 'user-123';
      const token = authService.generateToken(userId);

      expect(authService.validateToken(token)).toBe(true);

      authService.revokeToken(token);

      expect(authService.validateToken(token)).toBe(false);
    });

    it('should add token to revoked tokens list', () => {
      const userId = 'user-123';
      const token = authService.generateToken(userId);

      expect(authService.getRevokedTokensCountForTesting()).toBe(0);

      authService.revokeToken(token);

      expect(authService.getRevokedTokensCountForTesting()).toBe(1);
    });

    it('should allow revoking multiple tokens', () => {
      const token1 = authService.generateToken('user-123');
      const token2 = authService.generateToken('user-456');

      authService.revokeToken(token1);
      authService.revokeToken(token2);

      expect(authService.validateToken(token1)).toBe(false);
      expect(authService.validateToken(token2)).toBe(false);
      expect(authService.getRevokedTokensCountForTesting()).toBe(2);
    });
  });

  describe('getCurrentUserIdFromToken', () => {
    it('should extract userId from a valid token', () => {
      const userId = 'user-123';
      const token = authService.generateToken(userId);
      const extractedUserId = authService.getCurrentUserIdFromToken(token);

      expect(extractedUserId).toBe(userId);
    });

    it('should throw error for an invalid token', () => {
      expect(() => {
        authService.getCurrentUserIdFromToken('invalid-token');
      }).toThrow('Invalid or revoked token');
    });

    it('should throw error for a revoked token', () => {
      const userId = 'user-123';
      const token = authService.generateToken(userId);

      authService.revokeToken(token);

      expect(() => {
        authService.getCurrentUserIdFromToken(token);
      }).toThrow('Invalid or revoked token');
    });

    it('should throw error for an empty token', () => {
      expect(() => {
        authService.getCurrentUserIdFromToken('');
      }).toThrow('Invalid or revoked token');
    });
  });

  describe('clearRevokedTokensForTesting', () => {
    it('should clear all revoked tokens', () => {
      const token1 = authService.generateToken('user-123');
      const token2 = authService.generateToken('user-456');

      authService.revokeToken(token1);
      authService.revokeToken(token2);

      expect(authService.getRevokedTokensCountForTesting()).toBe(2);

      authService.clearRevokedTokensForTesting();

      expect(authService.getRevokedTokensCountForTesting()).toBe(0);
    });

    it('should allow previously revoked tokens to be valid again after clearing', () => {
      const userId = 'user-123';
      const token = authService.generateToken(userId);

      authService.revokeToken(token);
      expect(authService.validateToken(token)).toBe(false);

      authService.clearRevokedTokensForTesting();
      expect(authService.validateToken(token)).toBe(true);
    });
  });
});
