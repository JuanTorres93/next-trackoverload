import { MemoryTransactionContext } from '../../infra/services/TransactionContext/MemoryTransactionContext/MemoryTransactionContext';
import { MongoTransactionContext } from '../../infra/services/TransactionContext/MongoTransactionContext/MongoTransactionContext';
import { injectFor_ProductionDevelopment_Test } from '../common/injectFor_ProductionDevelopment_Test';

export const AppTransactionContext = injectFor_ProductionDevelopment_Test(
  // NOTE: Could be changed in production environment for ease of starting the app without a MongoDB instance
  MongoTransactionContext,
  MemoryTransactionContext,
);
