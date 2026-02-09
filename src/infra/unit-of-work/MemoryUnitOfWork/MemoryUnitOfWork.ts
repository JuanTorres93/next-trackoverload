import { BaseUnitOfWork } from '../../../application-layer/unit-of-work/BaseUnitOfWork';

export class MemoryUnitOfWork extends BaseUnitOfWork {
  private isActive: boolean = false;

  async begin(): Promise<void> {
    if (this.isActive) {
      throw new Error('Transaction already active');
    }
    this.isActive = true;
  }

  async commit(): Promise<void> {
    if (!this.isActive) {
      throw new Error('No active transaction to commit');
    }
    this.isActive = false;
  }

  async rollback(): Promise<void> {
    if (!this.isActive) {
      throw new Error('No active transaction to rollback');
    }
    this.isActive = false;
  }

  // For testing purposes
  public isTransactionActive(): boolean {
    return this.isActive;
  }
}
