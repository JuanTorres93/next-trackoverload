import { User, UserCreateProps } from '@/domain/entities/user/User';

export const userId = 'user-1';

export const validUserProps = {
  id: userId,
  name: 'Test User',
  email: 'testuser@example.com',
  hashedPassword:
    'IAmAReallyStrongHashedPasswordThatShouldWorkFineInTests1234567890',
  customerId: 'customer-123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function createTestUser(props?: Partial<UserCreateProps>): User {
  return User.create({
    id: props?.id || userId,
    name: props?.name || validUserProps.name,
    email: props?.email || validUserProps.email,
    hashedPassword: props?.hashedPassword || validUserProps.hashedPassword,
    customerId: props?.customerId || validUserProps.customerId,
    createdAt: props?.createdAt || validUserProps.createdAt,
    updatedAt: props?.updatedAt || validUserProps.updatedAt,
  });
}
