import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryUnitOfWork } from '../MemoryUnitOfWork';

describe('MemoryUnitOfWork', () => {
  let uow: MemoryUnitOfWork;

  beforeEach(() => {
    uow = new MemoryUnitOfWork();
  });

  describe('begin', () => {
    it('should start a transaction', async () => {
      await uow.begin();
      expect(uow.isTransactionActive()).toBe(true);
    });

    it('should throw error if transaction is already active', async () => {
      await uow.begin();
      await expect(uow.begin()).rejects.toThrow('Transaction already active');
    });
  });

  describe('commit', () => {
    it('should commit an active transaction', async () => {
      await uow.begin();
      await uow.commit();
      expect(uow.isTransactionActive()).toBe(false);
    });

    it('should throw error if no active transaction', async () => {
      await expect(uow.commit()).rejects.toThrow(
        'No active transaction to commit',
      );
    });
  });

  describe('rollback', () => {
    it('should rollback an active transaction', async () => {
      await uow.begin();
      await uow.rollback();
      expect(uow.isTransactionActive()).toBe(false);
    });

    it('should throw error if no active transaction', async () => {
      await expect(uow.rollback()).rejects.toThrow(
        'No active transaction to rollback',
      );
    });
  });

  describe('inTransaction', () => {
    it('should execute work within a transaction and commit on success', async () => {
      const mockWork = async () => {
        expect(uow.isTransactionActive()).toBe(true);
        return 'result';
      };

      const result = await uow.inTransaction(mockWork);

      expect(result).toBe('result');
      expect(uow.isTransactionActive()).toBe(false);
    });

    it('should rollback transaction on error', async () => {
      const mockWork = async () => {
        expect(uow.isTransactionActive()).toBe(true);
        throw new Error('Work failed');
      };

      await expect(uow.inTransaction(mockWork)).rejects.toThrow('Work failed');
      expect(uow.isTransactionActive()).toBe(false);
    });

    it('should propagate the error thrown by work', async () => {
      const error = new Error('Custom error');
      const mockWork = async () => {
        throw error;
      };

      await expect(uow.inTransaction(mockWork)).rejects.toThrow(error);
    });

    it('should handle multiple sequential transactions', async () => {
      const work1 = async () => 'result1';
      const work2 = async () => 'result2';

      const result1 = await uow.inTransaction(work1);
      const result2 = await uow.inTransaction(work2);

      expect(result1).toBe('result1');
      expect(result2).toBe('result2');
      expect(uow.isTransactionActive()).toBe(false);
    });
  });
});
