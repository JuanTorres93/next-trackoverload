import DayMongo from '../DayMongo';
import { dayDTOProperties } from '../../../../../../tests/dtoProperties';
import { assertMongooseModelMatchesDTOProperties } from './assertMongooseSchemaMatchesProperties';

describe('DayMongo', () => {
  it('should have (at least) same properties as DTO', () => {
    assertMongooseModelMatchesDTOProperties(DayMongo, dayDTOProperties);
  });
});
