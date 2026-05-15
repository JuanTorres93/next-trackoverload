import { PasswordEncryptorService } from "@/domain/services/PasswordEncryptorService.port";
import { BcryptPasswordEncryptorService } from "@/infra/services/PasswordEncryptorService/BcryptPasswordEncryptorService/BcryptPasswordEncryptorService";
import { DummyPasswordEncryptorService } from "@/infra/services/PasswordEncryptorService/DummyPasswordEncryptorService/DummyPasswordEncryptorService";
import { injectFor_ProductionDevelopment_Test } from "@/interface-adapters/common/injectFor_ProductionDevelopment_Test";

const AppPasswordEncryptorService: PasswordEncryptorService =
  await injectFor_ProductionDevelopment_Test<PasswordEncryptorService>(
    BcryptPasswordEncryptorService,
    DummyPasswordEncryptorService,
  );

export { AppPasswordEncryptorService };
