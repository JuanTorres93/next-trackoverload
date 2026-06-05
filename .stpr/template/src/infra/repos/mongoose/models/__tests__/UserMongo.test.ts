import { describe, it } from 'vitest';

import { userDTOProperties } from '@/../tests/dtoProperties/userDtoProperties';

import UserMongo from '../UserMongo';
import { assertMongooseModelMatchesDTOProperties } from './assertMongooseSchemaMatchesProperties';

describe('UserMongo', () => {
  it('should have (at least) same properties as DTO', () => {
    assertMongooseModelMatchesDTOProperties(UserMongo, userDTOProperties);
  });
});
