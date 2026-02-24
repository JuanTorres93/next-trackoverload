import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryAuthService } from '../MemoryAuthService';

describe('MemoryAuthService', () => {
  let authService: MemoryAuthService;

  beforeEach(() => {
    authService = new MemoryAuthService();
  });

  describe('generateToken', () => {
    it('should generate a token for a given userId', async () => {
      const userId = 'user-123';
      const token = await authService.generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate different tokens for the same userId at different times', async () => {
      const userId = 'user-123';
      const token1 = await authService.generateToken(userId);
      const token2 = await authService.generateToken(userId);

      expect(token1).not.toBe(token2);
    });

    it('should generate different tokens for different userIds', async () => {
      const token1 = await authService.generateToken('user-123');
      const token2 = await authService.generateToken('user-456');

      expect(token1).not.toBe(token2);
    });
  });

  describe('validateToken', () => {
    it('should validate a valid token', async () => {
      const userId = 'user-123';
      const token = await authService.generateToken(userId);
      const isValid = await authService.validateToken(token);

      expect(isValid).toBe(true);
    });

    it('should invalidate a malformed token', async () => {
      const isValid = await authService.validateToken('invalid-token');

      expect(isValid).toBe(false);
    });

    it('should invalidate an empty token', async () => {
      const isValid = await authService.validateToken('');

      expect(isValid).toBe(false);
    });

    it('should invalidate a revoked token', async () => {
      const userId = 'user-123';
      const token = await authService.generateToken(userId);

      authService.revokeToken(token);
      const isValid = await authService.validateToken(token);

      expect(isValid).toBe(false);
    });
  });

  describe('revokeToken', () => {
    it('should revoke a token', async () => {
      const userId = 'user-123';
      const token = await authService.generateToken(userId);

      expect(await authService.validateToken(token)).toBe(true);

      authService.revokeToken(token);

      expect(await authService.validateToken(token)).toBe(false);
    });

    it('should add token to revoked tokens list', async () => {
      const userId = 'user-123';
      const token = await authService.generateToken(userId);

      expect(authService.getRevokedTokensCountForTesting()).toBe(0);

      authService.revokeToken(token);

      expect(authService.getRevokedTokensCountForTesting()).toBe(1);
    });

    it('should allow revoking multiple tokens', async () => {
      const token1 = await authService.generateToken('user-123');
      const token2 = await authService.generateToken('user-456');

      authService.revokeToken(token1);
      authService.revokeToken(token2);

      expect(await authService.validateToken(token1)).toBe(false);
      expect(await authService.validateToken(token2)).toBe(false);
      expect(authService.getRevokedTokensCountForTesting()).toBe(2);
    });
  });

  describe('getCurrentUserIdFromToken', () => {
    it('should extract userId from a valid token', async () => {
      const userId = 'user-123';
      const token = await authService.generateToken(userId);
      const extractedUserId =
        await authService.getCurrentUserIdFromToken(token);

      expect(extractedUserId).toBe(userId);
    });

    it('should throw error for an invalid token', async () => {
      await expect(
        authService.getCurrentUserIdFromToken('invalid-token'),
      ).rejects.toThrow('Invalid or revoked token');
    });

    it('should throw error for a revoked token', async () => {
      const userId = 'user-123';
      const token = await authService.generateToken(userId);

      authService.revokeToken(token);

      await expect(
        authService.getCurrentUserIdFromToken(token),
      ).rejects.toThrow('Invalid or revoked token');
    });

    it('should throw error for an empty token', async () => {
      await expect(authService.getCurrentUserIdFromToken('')).rejects.toThrow(
        'Invalid or revoked token',
      );
    });
  });

  describe('clearRevokedTokensForTesting', () => {
    it('should clear all revoked tokens', async () => {
      const token1 = await authService.generateToken('user-123');
      const token2 = await authService.generateToken('user-456');

      authService.revokeToken(token1);
      authService.revokeToken(token2);

      expect(authService.getRevokedTokensCountForTesting()).toBe(2);

      authService.clearRevokedTokensForTesting();

      expect(authService.getRevokedTokensCountForTesting()).toBe(0);
    });

    it('should allow previously revoked tokens to be valid again after clearing', async () => {
      const userId = 'user-123';
      const token = await authService.generateToken(userId);

      authService.revokeToken(token);
      expect(await authService.validateToken(token)).toBe(false);

      authService.clearRevokedTokensForTesting();
      expect(await authService.validateToken(token)).toBe(true);
    });
  });
});
