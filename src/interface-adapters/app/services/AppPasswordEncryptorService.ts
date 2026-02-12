import { DummyPasswordEncryptorService } from '@/infra/services/PasswordEncryptorService/DummyPasswordEncryptorService/DummyPasswordEncryptorService';
import { BcryptPasswordEncryptorService } from '@/infra/services/PasswordEncryptorService/BcryptPasswordEncryptorService/BcryptPasswordEncryptorService';

let AppPasswordEncryptorService:
  | BcryptPasswordEncryptorService
  | DummyPasswordEncryptorService;

if (process.env.NODE_ENV === 'test') {
  AppPasswordEncryptorService = new DummyPasswordEncryptorService();
} else {
  AppPasswordEncryptorService = new BcryptPasswordEncryptorService();
}

export { AppPasswordEncryptorService };
