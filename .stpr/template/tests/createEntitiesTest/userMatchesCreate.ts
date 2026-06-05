import {
  UserMatches,
  UserMatchesCreateProps,
} from '../../src/domain/entities/usermatches/UserMatches';
import { testUserId } from './userCreate';

export const userMatchesTestCreateProps: UserMatchesCreateProps = {
  id: 'userMatches-id',

  userId: testUserId,

  currentlyMatchedUserIds: ['matched-user-id-1', 'matched-user-id-2'],
  unmatchedUserIds: ['unmatched-user-id-1'],
  blockedUserIds: ['blocked-user-id-1'],

  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestUserMatches(
  overrideProps?: Partial<UserMatchesCreateProps>,
): UserMatches {
  const props = { ...userMatchesTestCreateProps, ...overrideProps };

  return UserMatches.create(props);
}
