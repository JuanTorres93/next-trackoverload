import { PasswordHasher } from '@/application-layer/services/PasswordHasher';
import { BcryptPasswordHasher } from '@/infra/services/PasswordHasher/BcryptPasswordHasher/BcryptPasswordHasher';
import { DummyPasswordHasher } from '@/infra/services/PasswordHasher/DummyPasswordHasher/DummyPasswordHasher';

import { injectFor_ProductionDevelopment_Test } from '../common/injectFor_ProductionDevelopment_Test';

const AppPasswordHasher: PasswordHasher =
  await injectFor_ProductionDevelopment_Test<PasswordHasher>(
    BcryptPasswordHasher,
    DummyPasswordHasher,
  );

export { AppPasswordHasher };
