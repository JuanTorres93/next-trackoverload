import { beforeEach, describe, expect, it } from 'vitest';

import { createTestUserMatches } from '../../../../tests/createEntitiesTest/userMatchesCreate';
import { userMatchesDTOProperties } from '../../../../tests/dtoProperties/userMatchesDtoProperties';
import { UserMatches } from '../../../domain/entities/usermatches/UserMatches';
import { UserMatchesDTO, toUserMatchesDTO } from '../UserMatchesDTO';

describe('UserMatchesDTO', () => {
  let userMatches: UserMatches;
  let entityDTO: UserMatchesDTO;

  beforeEach(() => {
    userMatches = createTestUserMatches();
  });

  describe('toUserMatchesDTO', () => {
    beforeEach(() => {
      entityDTO = toUserMatchesDTO(userMatches);
    });

    it('should have a prop for each userMatches getter', () => {
      for (const getter of userMatchesDTOProperties) {
        expect(entityDTO).toHaveProperty(getter);
      }
    });
  });
});
