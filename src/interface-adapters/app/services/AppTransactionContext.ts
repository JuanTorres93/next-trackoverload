import { AdapterError } from '@/domain/common/errors';
import { MemoryTransactionContext } from '@/infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import { mongooseInitPromise } from '../repos/common/initMongoose';
import { TransactionContext } from '@/application-layer/ports/TransactionContext.port';

let AppTransactionContext: TransactionContext;

if (process.env.NODE_ENV === 'test') {
  AppTransactionContext = new MemoryTransactionContext();
} else if (process.env.NODE_ENV === 'development') {
  await mongooseInitPromise;
  AppTransactionContext = new MongoTransactionContext();
}
// TODO implement production
else {
  throw new AdapterError(
    "AppTransactionContext: NODE_ENV must be one of 'production', 'development', or 'test'",
  );
}

export { AppTransactionContext };
