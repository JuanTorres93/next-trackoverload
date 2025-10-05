import { ValidationError } from './errors';

export const validateNonEmptyString = (
  value: string,
  context: string
): void => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationError(`${context}: Invalid string`);
  }
};

export const validateNumber = (value: number, context: string): void => {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${context}: Invalid number`);
  }
};

export const validatePositiveNumber = (
  value: number,
  context: string
): void => {
  if (typeof value !== 'number' || isNaN(value) || value < 0) {
    throw new ValidationError(`${context}: Number must be positive`);
  }
};

export const validateGreaterThanZero = (
  value: number,
  context: string
): void => {
  if (typeof value !== 'number' || isNaN(value) || value <= 0) {
    throw new ValidationError(`${context}: Number must be greater than zero`);
  }
};

export const validateInteger = (value: number, context: string): void => {
  if (typeof value !== 'number' || isNaN(value) || !Number.isInteger(value)) {
    throw new ValidationError(`${context}: Invalid integer`);
  }
};

export const validateObject = (value: object, context: string): void => {
  if (typeof value !== 'object' || value === null) {
    throw new ValidationError(`${context}: Invalid object`);
  }
};

export const validateDate = (value: Date, context: string): void => {
  if (!(value instanceof Date) || isNaN(value.getTime())) {
    throw new ValidationError(`${context}: Invalid date`);
  }
};
