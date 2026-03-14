import UserMongo from '../UserMongo';
import { userDTOProperties } from '../../../../../../tests/dtoProperties';
import { assertMongooseModelMatchesDTOProperties } from './assertMongooseSchemaMatchesProperties';

describe('UserMongo', () => {
  it('should have (at least) same properties as DTO', () => {
    assertMongooseModelMatchesDTOProperties(UserMongo, userDTOProperties);
  });
});
