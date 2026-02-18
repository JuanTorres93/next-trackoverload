import {
  getMongooseDevelopmentInstance,
  getMongooseProductionInstance,
} from '@/infra/repos/mongo/config';

// This promise runs on module import and is shared across all repos
// All repos adapters that import it will wait for this same promise
export const mongooseInitPromise = (async () => {
  if (process.env.NODE_ENV === 'development') {
    await getMongooseDevelopmentInstance();
  }
  if (process.env.NODE_ENV === 'production') {
    await getMongooseProductionInstance();
  }
})();
