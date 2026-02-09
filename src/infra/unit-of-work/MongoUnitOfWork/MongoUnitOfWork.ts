import mongoose from 'mongoose';
import { BaseUnitOfWork } from '../../../application-layer/unit-of-work/BaseUnitOfWork';
import { InfrastructureError } from '@/domain/common/errors';

export class MongoUnitOfWork extends BaseUnitOfWork {
  private session: mongoose.ClientSession | null = null;

  async begin(): Promise<void> {
    if (this.session) {
      throw new InfrastructureError(
        'MongoUnitOfWork: Transaction already active',
      );
    }
    this.session = await mongoose.startSession();
    this.session.startTransaction();
  }

  async commit(): Promise<void> {
    if (!this.session) {
      throw new InfrastructureError(
        'MongoUnitOfWork: No active transaction to commit',
      );
    }
    try {
      await this.session.commitTransaction();
    } finally {
      await this.session.endSession();
      this.session = null;
    }
  }

  async rollback(): Promise<void> {
    if (!this.session) {
      throw new InfrastructureError(
        'MongoUnitOfWork: No active transaction to rollback',
      );
    }
    try {
      await this.session.abortTransaction();
    } finally {
      await this.session.endSession();
      this.session = null;
    }
  }

  public _testingIsTransactionActive(): boolean {
    return this.session !== null && this.session.inTransaction();
  }
}
