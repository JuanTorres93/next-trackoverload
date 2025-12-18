import { IdGenerator } from '@/domain/services/IdGenerator.port';
import { v4 as uuidv4 } from 'uuid';

export class Uuidv4IdGenerator implements IdGenerator {
  generateId(): string {
    return uuidv4();
  }
}
