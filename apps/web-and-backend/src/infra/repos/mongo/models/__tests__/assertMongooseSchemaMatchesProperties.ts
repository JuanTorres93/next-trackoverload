import { Model } from 'mongoose';

export function assertMongooseModelMatchesDTOProperties<T>(
  mongoModel: Model<T>,
  dtoProperties: string[],
) {
  const schemaProperties = Object.keys(mongoModel.schema.paths);

  dtoProperties.forEach((prop) => {
    if (prop === 'id') {
      expect(schemaProperties).toContain('_id');
      return;
    }

    expect(schemaProperties).toContain(prop);
  });
}
