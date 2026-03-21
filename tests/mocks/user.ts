import { User } from '@/domain/entities/user/User';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { validUserProps } from '../createProps/userTestProps';

export const testUserId = 'dev-user';

export const createMockUser = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('createMockUser should only be used in tests');
  }

  const user = User.create({
    ...validUserProps,
    id: testUserId,
  });

  await AppUsersRepo.saveUser(user);

  const mockUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    hasValidSubscription: user.hasValidSubscription,
    customerId: user.customerId,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };

  afterAll(async () => {
    // Clean up the mock user after tests

    // @ts-expect-error AppUsersRepo will always be MemoryUsersRepo
    await AppUsersRepo.clearForTesting(mockUser.id);
  });

  return mockUser;
};
