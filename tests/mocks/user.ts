import { User } from '@/domain/entities/user/User';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';

export const testUserId = 'dev-user';

export const createMockUser = async () => {
  const user = User.create({
    id: testUserId,
    name: 'test user',
    email: 'testuser@example.com',
    hashedPassword: 'test-hashed-password-for-dev-user-123456789',
  });

  await AppUsersRepo.saveUser(user);

  const mockUser = {
    id: user.id,
    name: user.name,
    email: user.email,
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
