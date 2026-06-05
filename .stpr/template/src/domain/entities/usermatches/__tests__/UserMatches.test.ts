import { userMatchesTestCreateProps } from 'tests/createEntitiesTest/userMatchesCreate';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  AlreadyExistsDomainError,
  NotFoundDomainError,
  ValidationDomainError,
} from '../../../common/domainErrors';
import { UserMatches, UserMatchesCreateProps } from '../UserMatches';

describe('UserMatches', () => {
  let userMatches: UserMatches;
  let validUserMatchesProps: UserMatchesCreateProps;

  beforeEach(() => {
    validUserMatchesProps = {
      ...userMatchesTestCreateProps,
    };
    userMatches = UserMatches.create(validUserMatchesProps);
  });

  it('should create a valid userMatches', () => {
    expect(userMatches).toBeInstanceOf(UserMatches);
  });

  it('should convert to create props', async () => {
    const createProps = userMatches.toCreateProps();

    expect(createProps).toEqual(validUserMatchesProps);
  });

  describe('behaviour', () => {
    describe('match', () => {
      it('should add a match', async () => {
        const newMatchedUserId = 'new-matched-user-id';

        userMatches.match(newMatchedUserId);

        expect(userMatches.currentlyMatchedUserIds).toContain(newMatchedUserId);
      });

      it('should update the updatedAt timestamp when adding a match', async () => {
        const oldUpdatedAt = userMatches.updatedAt;

        // Wait for a short time to ensure the timestamp will be different
        await new Promise((resolve) => setTimeout(resolve, 10));

        userMatches.match('another-new-matched-user-id');

        expect(userMatches.updatedAt).not.toEqual(oldUpdatedAt);
      });

      it('should match an unmatched user', async () => {
        const unmatchedUserId = validUserMatchesProps.unmatchedUserIds[0];

        expect(userMatches.currentlyMatchedUserIds).not.toContain(unmatchedUserId);
        expect(userMatches.unmatchedUserIds).toContain(unmatchedUserId);

        userMatches.match(unmatchedUserId);

        expect(userMatches.currentlyMatchedUserIds).toContain(unmatchedUserId);
        expect(userMatches.unmatchedUserIds).not.toContain(unmatchedUserId);
      });
    });

    describe('unmatch', () => {
      it('should unmatch a matched user', async () => {
        const matchedUserIdToUnmatch = validUserMatchesProps.currentlyMatchedUserIds[0];

        userMatches.unmatch(matchedUserIdToUnmatch);

        // Remove from currentlyMatchedUserIds
        expect(userMatches.currentlyMatchedUserIds).not.toContain(matchedUserIdToUnmatch);

        // Add to unmatchedUserIds
        expect(userMatches.unmatchedUserIds).toContain(matchedUserIdToUnmatch);
      });

      it('should update the updatedAt timestamp when unmatching a user', async () => {
        const oldUpdatedAt = userMatches.updatedAt;

        // Wait for a short time to ensure the timestamp will be different
        await new Promise((resolve) => setTimeout(resolve, 10));

        const matchedUserIdToUnmatch = validUserMatchesProps.currentlyMatchedUserIds[1];
        userMatches.unmatch(matchedUserIdToUnmatch);

        expect(userMatches.updatedAt).not.toEqual(oldUpdatedAt);
      });
    });

    describe('block', () => {
      it('should block a user with no relationship with', async () => {
        const userIdToBlock = 'user-id-to-block';

        userMatches.block(userIdToBlock);

        expect(userMatches.blockedUserIds).toContain(userIdToBlock);
      });

      it('should block a matched user', async () => {
        const userIdToBlock = userMatches.currentlyMatchedUserIds[0];

        userMatches.block(userIdToBlock);

        // Remove from currentlyMatchedUserIds
        expect(userMatches.currentlyMatchedUserIds).not.toContain(userIdToBlock);

        // Add to blockedUserIds
        expect(userMatches.blockedUserIds).toContain(userIdToBlock);
      });

      it('should block an unmatched user', async () => {
        const unmatchedUserId = validUserMatchesProps.unmatchedUserIds[0];

        userMatches.block(unmatchedUserId);

        // Remove from unmatchedUserIds
        expect(userMatches.unmatchedUserIds).not.toContain(unmatchedUserId);

        // Add to blockedUserIds
        expect(userMatches.blockedUserIds).toContain(unmatchedUserId);
      });

      it('should update the updatedAt timestamp when blocking a user', async () => {
        const oldUpdatedAt = userMatches.updatedAt;

        // Wait for a short time to ensure the timestamp will be different
        await new Promise((resolve) => setTimeout(resolve, 10));

        const userIdToBlock = 'another-user-id-to-block';
        userMatches.block(userIdToBlock);

        expect(userMatches.updatedAt).not.toEqual(oldUpdatedAt);
      });
    });
  });

  describe('getters', () => {
    it('should return the correct id', () => {
      expect(userMatches.id).toBe(validUserMatchesProps.id);
    });

    it('should return the correct userId', () => {
      expect(userMatches.userId).toBe(validUserMatchesProps.userId);
    });

    it('should return the correct currentlyMatchedUserIds', () => {
      expect(userMatches.currentlyMatchedUserIds).toEqual(
        validUserMatchesProps.currentlyMatchedUserIds,
      );
    });

    it('should return the correct unmatchedUserIds', () => {
      expect(userMatches.unmatchedUserIds).toEqual(validUserMatchesProps.unmatchedUserIds);
    });

    it('should return the correct blockedUserIds', () => {
      expect(userMatches.blockedUserIds).toEqual(validUserMatchesProps.blockedUserIds);
    });

    it('should return the correct createdAt', () => {
      expect(userMatches.createdAt).toEqual(validUserMatchesProps.createdAt);
    });

    it('should return the correct updatedAt', () => {
      expect(userMatches.updatedAt).toEqual(validUserMatchesProps.updatedAt);
    });
  });

  describe('Errors', () => {
    it('should throw error if trying to add an existing match', async () => {
      const existingMatchedUserId = validUserMatchesProps.currentlyMatchedUserIds[0];

      expect(() => userMatches.match(existingMatchedUserId)).toThrow(AlreadyExistsDomainError);

      expect(() => userMatches.match(existingMatchedUserId)).toThrow(/Match.*userId.*already.*/);
    });

    it('should throw error if trying to match oneself', async () => {
      const userId = validUserMatchesProps.userId;

      expect(() => userMatches.match(userId)).toThrow(ValidationDomainError);

      expect(() => userMatches.match(userId)).toThrow(/Cannot match with oneself/);
    });

    it('should not throw error if trying to unmatch a user that is not currently matched', async () => {
      const nonMatchedUserId = 'non-matched-user-id';

      expect(() => userMatches.unmatch(nonMatchedUserId)).toThrow(NotFoundDomainError);

      expect(() => userMatches.unmatch(nonMatchedUserId)).toThrow(
        /Cannot unmatch.*not currently matched/,
      );
    });

    it('should throw error if matching a blocked user', async () => {
      const blockedUserId = validUserMatchesProps.blockedUserIds[0];

      expect(() => userMatches.match(blockedUserId)).toThrow(ValidationDomainError);

      expect(() => userMatches.match(blockedUserId)).toThrow(/Cannot match with a blocked user/);
    });
  });
});
