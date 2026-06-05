import {
  AlreadyExistsDomainError,
  NotFoundDomainError,
  ValidationDomainError,
} from '../../common/domainErrors';
import { DomainDate } from '../../value-objects/DomainDate/DomainDate';
import { Id } from '../../value-objects/Id/Id';

export type UserMatchesCreateProps = {
  id: string;

  userId: string;

  currentlyMatchedUserIds: string[];
  unmatchedUserIds: string[];
  blockedUserIds: string[];

  createdAt: Date;
  updatedAt: Date;
};

export type UserMatchesProps = {
  id: Id;

  userId: Id;

  currentlyMatchedUserIds: Id[];
  unmatchedUserIds: Id[];
  blockedUserIds: Id[];

  createdAt: DomainDate;
  updatedAt: DomainDate;
};

export class UserMatches {
  private constructor(private readonly props: UserMatchesProps) {}

  static create(props: UserMatchesCreateProps): UserMatches {
    const entityProps: UserMatchesProps = {
      id: Id.create(props.id),

      userId: Id.create(props.userId),

      currentlyMatchedUserIds: props.currentlyMatchedUserIds.map((id) => Id.create(id)),
      unmatchedUserIds: props.unmatchedUserIds.map((id) => Id.create(id)),
      blockedUserIds: props.blockedUserIds.map((id) => Id.create(id)),

      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
    };

    return new UserMatches(entityProps);
  }

  match(userId: string) {
    const validatedUserId = Id.create(userId);

    const validatedUserIdValue = validatedUserId.value;

    // Guards
    if (this.props.userId.value === validatedUserIdValue)
      throw new ValidationDomainError(`Cannot match with oneself.`);

    if (this.isMatched(validatedUserIdValue))
      throw new AlreadyExistsDomainError(
        `Match with userId ${validatedUserIdValue} already exists.`,
      );

    if (this.isBlocked(validatedUserIdValue))
      throw new ValidationDomainError(`Cannot match with a blocked user.`);

    // Behaviour
    if (this.isUnmatched(validatedUserIdValue)) this.removeFromUnmatches(validatedUserIdValue);

    this.addToMatches(validatedUserIdValue);

    this.updateTimestamp();
  }

  unmatch(userId: string) {
    const validatedUserId = Id.create(userId);
    const validatedUserIdValue = validatedUserId.value;

    // Guards
    if (!this.isMatched(validatedUserIdValue))
      throw new NotFoundDomainError(
        `Cannot unmatch userId ${validatedUserIdValue} because it is not currently matched.`,
      );

    // Behaviour
    if (!this.isUnmatched(validatedUserIdValue)) this.addToUnmatches(validatedUserIdValue);

    this.removeFromMatches(validatedUserIdValue);

    this.updateTimestamp();
  }

  block(userId: string) {
    const validatedUserId = Id.create(userId);
    const validatedUserIdValue = validatedUserId.value;

    // Behaviour
    if (!this.isBlocked(validatedUserIdValue)) {
      this.addToBlocks(validatedUserIdValue);
    }

    if (this.isMatched(validatedUserIdValue)) {
      this.removeFromMatches(validatedUserIdValue);
    }

    if (this.isUnmatched(validatedUserIdValue)) {
      this.removeFromUnmatches(validatedUserIdValue);
    }

    this.updateTimestamp();
  }

  toCreateProps(): UserMatchesCreateProps {
    return {
      id: this.id,

      userId: this.userId,

      currentlyMatchedUserIds: this.currentlyMatchedUserIds,
      unmatchedUserIds: this.unmatchedUserIds,
      blockedUserIds: this.blockedUserIds,

      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get userId() {
    return this.props.userId.value;
  }

  get currentlyMatchedUserIds() {
    return [...this.props.currentlyMatchedUserIds.map((id) => id.value)];
  }

  get unmatchedUserIds() {
    return [...this.props.unmatchedUserIds.map((id) => id.value)];
  }

  get blockedUserIds() {
    return [...this.props.blockedUserIds.map((id) => id.value)];
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }

  // Helpers
  private isMatched(userId: string): boolean {
    return this.props.currentlyMatchedUserIds.some((id) => id.value === userId);
  }

  private isUnmatched(userId: string): boolean {
    return this.props.unmatchedUserIds.some((id) => id.value === userId);
  }

  private isBlocked(userId: string): boolean {
    return this.props.blockedUserIds.some((id) => id.value === userId);
  }

  private removeFromMatches(userId: string) {
    this.props.currentlyMatchedUserIds = this.props.currentlyMatchedUserIds.filter(
      (id) => id.value !== userId,
    );
  }

  private removeFromUnmatches(userId: string) {
    this.props.unmatchedUserIds = this.props.unmatchedUserIds.filter((id) => id.value !== userId);
  }

  private addToMatches(userId: string) {
    const validatedUserId = Id.create(userId);

    if (!this.isMatched(validatedUserId.value)) {
      this.props.currentlyMatchedUserIds.push(validatedUserId);
    }
  }

  private addToUnmatches(userId: string) {
    const validatedUserId = Id.create(userId);

    if (!this.isUnmatched(validatedUserId.value)) {
      this.props.unmatchedUserIds.push(validatedUserId);
    }
  }

  private addToBlocks(userId: string) {
    const validatedUserId = Id.create(userId);

    if (!this.isBlocked(validatedUserId.value)) {
      this.props.blockedUserIds.push(validatedUserId);
    }
  }

  private updateTimestamp() {
    this.props.updatedAt = DomainDate.create(new Date());
  }
}
