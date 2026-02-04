import { UnitOfWork } from './UnitOfWork.port';

export abstract class BaseUnitOfWork implements UnitOfWork {
  abstract begin(): Promise<void>;
  abstract commit(): Promise<void>;
  abstract rollback(): Promise<void>;

  public async inTransaction<T>(work: () => Promise<T>): Promise<T> {
    await this.begin();

    try {
      const result = await work();
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }
}
