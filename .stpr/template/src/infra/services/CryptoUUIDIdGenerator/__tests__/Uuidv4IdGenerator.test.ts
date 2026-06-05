import { beforeEach, describe, expect, it } from 'vitest';

import { CryptoUUIDIdGenerator } from '../CryptoUUIDIdGenerator';

describe('CryptoUUIDIdGenerator', () => {
  let idGenerator: CryptoUUIDIdGenerator;

  beforeEach(() => {
    idGenerator = new CryptoUUIDIdGenerator();
  });

  it('should generate a valid UUID v4', () => {
    const uuid = idGenerator.generateId();

    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(uuidV4Regex.test(uuid)).toBe(true);
  });
});
