import mongoose from 'mongoose';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';

/**
 * Executes work within a MongoDB transaction.
 *
 * If there's an active transaction context (from a use case), it reuses that session.
 * Otherwise, it creates its own transaction for the repository operation.
 *
 * This allows repositories to work both standalone and within use case transactions.
 *
 * @param work - Function to execute within the transaction, receives the session
 * @returns The result from the work function
 */
export async function withTransaction<T>(
  work: (session: mongoose.ClientSession) => Promise<T>,
): Promise<T> {
  const existingSession = MongoTransactionContext.getSession();

  if (existingSession) {
    // Use existing session from use case transaction
    // If work fails, error propagates to the use case's transaction context
    // which will handle the rollback
    return await work(existingSession);
  }

  // Create own transaction for standalone repository usage
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await work(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}
