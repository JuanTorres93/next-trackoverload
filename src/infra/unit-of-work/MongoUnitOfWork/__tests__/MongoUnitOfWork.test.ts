import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';
import {
  setupMongoTestDB,
  teardownMongoTestDB,
} from '../../../repos/mongo/__tests__/setupMongoTestDB';
import { MongoUnitOfWork } from '../MongoUnitOfWork';
import { InfrastructureError } from '@/domain/common/errors';

describe('MongoUnitOfWork', () => {
  let uow: MongoUnitOfWork;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  beforeEach(() => {
    uow = new MongoUnitOfWork();
  });

  afterEach(async () => {
    // Clean up any active sessions
    if (uow._testingIsTransactionActive()) {
      await uow.rollback();
    }
  });

  describe('begin', () => {
    it('should start a transaction', async () => {
      await uow.begin();

      expect(uow._testingIsTransactionActive()).toBe(true);

      await uow.rollback(); // Clean up
    });

    it('should throw error if transaction is already active', async () => {
      await uow.begin();

      await expect(uow.begin()).rejects.toThrow(InfrastructureError);
      await expect(uow.begin()).rejects.toThrow('Transaction already active');

      await uow.rollback(); // Clean up
    });
  });

  describe('commit', () => {
    it('should commit an active transaction', async () => {
      await uow.begin();

      await uow.commit();

      expect(uow._testingIsTransactionActive()).toBe(false);
    });

    it('should throw error if no active transaction', async () => {
      await expect(uow.commit()).rejects.toThrow(InfrastructureError);
      await expect(uow.commit()).rejects.toThrow(
        'No active transaction to commit',
      );
    });
  });

  describe('rollback', () => {
    it('should rollback an active transaction', async () => {
      await uow.begin();

      await uow.rollback();

      expect(uow._testingIsTransactionActive()).toBe(false);
    });

    it('should throw error if no active transaction', async () => {
      await expect(uow.rollback()).rejects.toThrow(InfrastructureError);
      await expect(uow.rollback()).rejects.toThrow(
        'No active transaction to rollback',
      );
    });
  });

  describe('inTransaction', () => {
    it('should execute work within a transaction and commit on success', async () => {
      const mockWork = async () => {
        expect(uow._testingIsTransactionActive()).toBe(true);
        return 'result';
      };

      const result = await uow.inTransaction(mockWork);

      expect(result).toBe('result');
      expect(uow._testingIsTransactionActive()).toBe(false);
    });

    it('should rollback transaction on error', async () => {
      const mockWork = async () => {
        expect(uow._testingIsTransactionActive()).toBe(true);
        throw new Error('Work failed');
      };

      await expect(uow.inTransaction(mockWork)).rejects.toThrow('Work failed');
      expect(uow._testingIsTransactionActive()).toBe(false);
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
      expect(uow._testingIsTransactionActive()).toBe(false);
    });
  });
});
