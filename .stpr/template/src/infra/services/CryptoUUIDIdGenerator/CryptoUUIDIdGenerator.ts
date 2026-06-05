import { randomUUID } from 'node:crypto';

import { IdGenerator } from '../../../application-layer/services/IdGenerator.port';

export class CryptoUUIDIdGenerator implements IdGenerator {
  generateId(): string {
    return randomUUID();
  }
}
