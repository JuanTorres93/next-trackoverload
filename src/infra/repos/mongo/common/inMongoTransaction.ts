import mongoose from 'mongoose';

export async function inMongoTransaction(
  session: mongoose.ClientSession,
  work: () => Promise<void>,
): Promise<void> {
  try {
    await work();

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}
