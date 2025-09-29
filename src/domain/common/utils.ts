import { ValidationError } from './errors';

export const handleCreatedAt = (createdAt?: Date, context?: string): Date => {
  const now = new Date();
  if (createdAt) {
    if (!(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new ValidationError(`${context}: createdAt must be a valid date`);
    }
    return createdAt;
  }
  return now;
};

export const handleUpdatedAt = (updatedAt?: Date, context?: string): Date => {
  const now = new Date();
  if (updatedAt) {
    if (!(updatedAt instanceof Date) || isNaN(updatedAt.getTime())) {
      throw new ValidationError(`${context}: updatedAt must be a valid date`);
    }
    return updatedAt;
  }
  return now;
};
