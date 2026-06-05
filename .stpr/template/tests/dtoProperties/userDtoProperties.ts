import { getGetters } from '../../src/application-layer/dtos/__tests__/_getGettersUtil';
import { User } from '../../src/domain/entities/user/User';
import { userTestCreateProps } from '../createEntitiesTest/userCreate';

const sampleUser = User.create({
  ...userTestCreateProps,
});

const allUserGetters = getGetters(sampleUser);

export const userDTOProperties = allUserGetters.filter((getter) => getter !== 'hashedPassword');
