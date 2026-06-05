import { beforeEach, describe, expect, it } from 'vitest';

import { createTestUserMatches } from '@/../tests/createEntitiesTest/userMatchesCreate';
import { userMatchesDTOProperties } from '@/../tests/dtoProperties/userMatchesDtoProperties';
import { NotFoundApplicationError } from '@/application-layer/common/applicationErrors';
import { UserMatches } from '@/domain/entities/usermatches/UserMatches';
import { MemoryUserMatchesRepo } from '@/infra/repos/Memory/MemoryUserMatchesRepo';
import { MemoryTransactionContext } from '@/infra/services/TransactionContext/MemoryTransactionContext/MemoryTransactionContext';

import { MatchUsersUsecase, MatchUsersUsecaseRequest } from '../MatchUsersUsecase';

describe('MatchUsersUsecase', () => {
  let userMatchesRepo: MemoryUserMatchesRepo;
  let usecase: MatchUsersUsecase;
  let transactionContext: MemoryTransactionContext;

  let userMatches: UserMatches;
  let anotherUserMatches: UserMatches;

  let validRequest: MatchUsersUsecaseRequest;

  beforeEach(async () => {
    userMatchesRepo = new MemoryUserMatchesRepo();
    transactionContext = new MemoryTransactionContext();

    usecase = new MatchUsersUsecase(userMatchesRepo, transactionContext);

    userMatches = createTestUserMatches();
    anotherUserMatches = createTestUserMatches({
      id: 'another-matches-id',
      userId: 'another-user-id',
    });

    await userMatchesRepo.save(userMatches);
    await userMatchesRepo.save(anotherUserMatches);

    validRequest = {
      oneUserId: userMatches.userId,
      anotherUserId: anotherUserMatches.userId,
    };
  });

  describe('Execution', () => {
    it('should return object with userIds as keys and UserProfilesDTO as values', async () => {
      const result = await usecase.execute(validRequest);

      expect(Object.keys(result).length).toBe(2);

      for (const key of Object.keys(result)) {
        expect(result).not.toBeInstanceOf(UserMatches);

        for (const prop of userMatchesDTOProperties) {
          const userProfile = result[key];

          expect(userProfile).toHaveProperty(prop);
        }
      }
    });

    it('should update matches for both users ', async () => {
      // Ensure users are not already matched
      expect(userMatches.currentlyMatchedUserIds).not.toContain(anotherUserMatches.userId);

      expect(anotherUserMatches.currentlyMatchedUserIds).not.toContain(userMatches.userId);

      const result = await usecase.execute(validRequest);

      expect(result[userMatches.userId].currentlyMatchedUserIds).toContain(
        anotherUserMatches.userId,
      );

      expect(result[anotherUserMatches.userId].currentlyMatchedUserIds).toContain(
        userMatches.userId,
      );
    });
  });

  describe('Side effects', () => {
    it('should persist matches in the repository', async () => {
      await usecase.execute(validRequest);

      const updatedUserMatches = await userMatchesRepo.getByUserId(userMatches.userId);
      const updatedAnotherUserMatches = await userMatchesRepo.getByUserId(
        anotherUserMatches.userId,
      );

      expect(updatedUserMatches?.currentlyMatchedUserIds).toContain(anotherUserMatches.userId);

      expect(updatedAnotherUserMatches?.currentlyMatchedUserIds).toContain(userMatches.userId);
    });
  });

  describe('Errors', () => {
    it('it should throw error it at least one of the UserMatches does not exist', async () => {
      const invalidRequests = [
        {
          oneUserId: 'non-existent-user-id',
          anotherUserId: anotherUserMatches.userId,
        },
        {
          oneUserId: userMatches.userId,
          anotherUserId: 'non-existent-user-id',
        },
      ];

      for (const invalidRequest of invalidRequests) {
        await expect(usecase.execute(invalidRequest)).rejects.toThrow(NotFoundApplicationError);

        await expect(usecase.execute(invalidRequest)).rejects.toThrow(/UserMatches.*not found/);
      }
    });
  });
});
