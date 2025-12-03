// TODO delete this entire file and use the getters util in dtos
export const dayDTOProperties = [
  'id',
  'userId',
  'mealIds',
  'fakeMealIds',
  'createdAt',
  'updatedAt',
];

export const exerciseDTOProperties = ['id', 'name', 'createdAt', 'updatedAt'];

export const fakeMealDTOProperties = [
  'id',
  'userId',
  'name',
  'calories',
  'protein',
  'createdAt',
  'updatedAt',
];

export const ingredientDTOProperties = [
  'id',
  'name',
  'nutritionalInfoPer100g',
  'imageUrl',
  'createdAt',
  'updatedAt',
];

export const ingredientLineDTOProperties = [
  'id',
  'ingredient',
  'quantityInGrams',
  'calories',
  'protein',
  'createdAt',
  'updatedAt',
];

export const mealDTOProperties = [
  'id',
  'userId',
  'name',
  'ingredientLines',
  'calories',
  'protein',
  'createdAt',
  'updatedAt',
];

export const recipeDTOProperties = [
  'id',
  'userId',
  'name',
  'ingredientLines',
  'imageUrl',
  'calories',
  'protein',
  'createdAt',
  'updatedAt',
];

export const userDTOProperties = [
  'id',
  'name',
  'customerId',
  'createdAt',
  'updatedAt',
];

export const workoutDTOProperties = [
  'id',
  'userId',
  'name',
  'workoutTemplateId',
  'exercises',
  'createdAt',
  'updatedAt',
];

export const workoutTemplateDTOProperties = [
  'id',
  'userId',
  'name',
  'exercises',
  'createdAt',
  'updatedAt',
  'deletedAt',
];
