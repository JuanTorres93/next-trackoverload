import { getGetters } from '../../src/application-layer/dtos/__tests__/_getGettersUtil';
import { UserMatches } from '../../src/domain/entities/usermatches/UserMatches';
import { userMatchesTestCreateProps } from '../createEntitiesTest/userMatchesCreate';

const sampleUserMatches = UserMatches.create({
  ...userMatchesTestCreateProps,
});

const allUserMatchesGetters = getGetters(sampleUserMatches);

export const userMatchesDTOProperties = [...allUserMatchesGetters];
