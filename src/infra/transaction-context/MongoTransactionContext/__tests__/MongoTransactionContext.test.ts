import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import mongoose from 'mongoose';
import { MongoTransactionContext } from '../MongoTransactionContext';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from '../../../repos/mongo/__tests__/setupMongoTestDB';

// Simple test model for transaction tests
interface TestDoc {
  _id: string;
  name: string;
  value: number;
}

const TestSchema = new mongoose.Schema<TestDoc>({
  _id: String,
  name: String,
  value: Number,
});

describe('MongoTransactionContext', () => {
  let transactionContext: MongoTransactionContext;
  let TestModel: mongoose.Model<TestDoc>;

  beforeAll(async () => {
    await setupMongoTestDB();
    TestModel = mongoose.model<TestDoc>('TestDoc', TestSchema);
  });

  beforeEach(async () => {
    await clearMongoTestDB();
    transactionContext = new MongoTransactionContext();
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('run', () => {
    it('should execute work and commit transaction on success', async () => {
      await transactionContext.run(async () => {
        const session = MongoTransactionContext.getSession();

        await TestModel.create([{ _id: 'doc1', name: 'Test 1', value: 100 }], {
          session,
        });
        await TestModel.create([{ _id: 'doc2', name: 'Test 2', value: 200 }], {
          session,
        });
      });

      // Verify data was committed
      const docs = await TestModel.find({});
      expect(docs).toHaveLength(2);
      expect(docs[0].name).toBe('Test 1');
      expect(docs[1].name).toBe('Test 2');
    });

    it('should rollback transaction on error', async () => {
      try {
        await transactionContext.run(async () => {
          const session = MongoTransactionContext.getSession();

          await TestModel.create(
            [{ _id: 'doc1', name: 'Test 1', value: 100 }],
            { session },
          );

          // Simulate error
          throw new Error('Simulated error');
        });
      } catch (error) {
        expect((error as Error).message).toBe('Simulated error');
      }

      // Verify data was rolled back
      const docs = await TestModel.find({});
      expect(docs).toHaveLength(0);
    });

    it('should handle nested async operations', async () => {
      const result = await transactionContext.run(async () => {
        const session = MongoTransactionContext.getSession();

        await TestModel.create([{ _id: 'doc1', name: 'Test 1', value: 100 }], {
          session,
        });

        // Simulate nested async work
        await new Promise((resolve) => setTimeout(resolve, 10));

        await TestModel.create([{ _id: 'doc2', name: 'Test 2', value: 200 }], {
          session,
        });

        return 'success';
      });

      expect(result).toBe('success');

      const docs = await TestModel.find({});
      expect(docs).toHaveLength(2);
    });

    it('should return result from work function', async () => {
      const result = await transactionContext.run(async () => {
        const session = MongoTransactionContext.getSession();

        await TestModel.create([{ _id: 'doc1', name: 'Test', value: 42 }], {
          session,
        });

        return { status: 'completed', count: 1 };
      });

      expect(result).toEqual({ status: 'completed', count: 1 });
    });
  });

  describe('getSession', () => {
    it('should return session inside transaction context', async () => {
      await transactionContext.run(async () => {
        const session = transactionContext.getSession();
        expect(session).toBeDefined();
        expect(session).toBeInstanceOf(mongoose.mongo.ClientSession);
      });
    });

    it('should return undefined outside transaction context', () => {
      const session = transactionContext.getSession();
      expect(session).toBeUndefined();
    });

    it('should return session via static method', async () => {
      await transactionContext.run(async () => {
        const session = MongoTransactionContext.getSession();
        expect(session).toBeDefined();
        expect(session).toBeInstanceOf(mongoose.mongo.ClientSession);
      });
    });

    it('should return undefined via static method outside context', () => {
      const session = MongoTransactionContext.getSession();
      expect(session).toBeUndefined();
    });
  });

  describe('AsyncLocalStorage behavior', () => {
    it('should maintain separate sessions for concurrent transactions', async () => {
      const sessions: (mongoose.ClientSession | undefined)[] = [];

      // Execute two transactions concurrently
      await Promise.all([
        transactionContext.run(async () => {
          const session1 = MongoTransactionContext.getSession();
          sessions.push(session1);
          await new Promise((resolve) => setTimeout(resolve, 10));

          await TestModel.create(
            [{ _id: 'doc1', name: 'Transaction 1', value: 1 }],
            { session: session1 },
          );
        }),
        new MongoTransactionContext().run(async () => {
          const session2 = MongoTransactionContext.getSession();
          sessions.push(session2);
          await new Promise((resolve) => setTimeout(resolve, 10));

          await TestModel.create(
            [{ _id: 'doc2', name: 'Transaction 2', value: 2 }],
            { session: session2 },
          );
        }),
      ]);

      // Both sessions should exist and be different
      expect(sessions).toHaveLength(2);
      expect(sessions[0]).toBeDefined();
      expect(sessions[1]).toBeDefined();
      expect(sessions[0]).not.toBe(sessions[1]);

      // Both documents should be committed
      const docs = await TestModel.find({});
      expect(docs).toHaveLength(2);
    });

    it('should clean up session after transaction completes', async () => {
      await transactionContext.run(async () => {
        const session = MongoTransactionContext.getSession();
        expect(session).toBeDefined();
      });

      // Session should be undefined after transaction completes
      const sessionAfter = MongoTransactionContext.getSession();
      expect(sessionAfter).toBeUndefined();
    });

    it('should clean up session after transaction error', async () => {
      try {
        await transactionContext.run(async () => {
          const session = MongoTransactionContext.getSession();
          expect(session).toBeDefined();
          throw new Error('Test error');
        });
      } catch (error) {
        // Expected error
      }

      // Session should be undefined after error
      const sessionAfter = MongoTransactionContext.getSession();
      expect(sessionAfter).toBeUndefined();
    });
  });

  describe('Integration scenarios', () => {
    it('should work without explicit session (graceful degradation)', async () => {
      // Simulate repository method that checks for session
      const saveWithOptionalSession = async () => {
        const session = MongoTransactionContext.getSession();
        await TestModel.create(
          [{ _id: 'doc1', name: 'Test', value: 100 }],
          session ? { session } : {},
        );
      };

      // Works outside transaction
      await saveWithOptionalSession();

      const docs = await TestModel.find({});
      expect(docs).toHaveLength(1);
    });

    it('should handle complex transaction with multiple operations', async () => {
      await transactionContext.run(async () => {
        const session = MongoTransactionContext.getSession();

        // Create
        await TestModel.create([{ _id: 'doc1', name: 'Initial', value: 100 }], {
          session,
        });

        // Update
        await TestModel.updateOne(
          { _id: 'doc1' },
          { $set: { name: 'Updated', value: 200 } },
          { session },
        );

        // Find
        const doc = await TestModel.findOne({ _id: 'doc1' }).session(session!);
        expect(doc?.name).toBe('Updated');
        expect(doc?.value).toBe(200);

        // Create another
        await TestModel.create([{ _id: 'doc2', name: 'Second', value: 300 }], {
          session,
        });
      });

      const docs = await TestModel.find({});
      expect(docs).toHaveLength(2);
      expect(docs.find((d) => d._id === 'doc1')?.name).toBe('Updated');
      expect(docs.find((d) => d._id === 'doc2')?.value).toBe(300);
    });
  });
});
