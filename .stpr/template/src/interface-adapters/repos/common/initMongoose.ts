import { MongooseAdapterError } from '@/interface-adapters/common/adapterErrors';

import { MONGODB_URI, startMongooseConnection } from '../../../infra/repos/mongoose/config';

// This promise runs on module import and is shared across all repos
// All repos adapters that import it will wait for this same promise
export const mongooseInitPromise = (async () => {
  // Skip DB connection during Next.js build phase (e.g. Vercel build servers
  // have no access to MongoDB — the actual connection happens at runtime)
  // if (process.env.NEXT_PHASE === "phase-production-build") return;

  if (process.env.NODE_ENV === 'test') return;

  if (!MONGODB_URI) throw new MongooseAdapterError('MONGODB_URI is not defined');

  await startMongooseConnection(MONGODB_URI);
})();
