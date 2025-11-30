import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppCreateUserUsecase } from '@/interface-adapters/app/use-cases/user';

export const testUserId = 'dev-user';

export const createMockUser = async () => {
  const mockUser = await AppCreateUserUsecase.execute({
    name: 'test user',
  });

  // TODO IMPORTANT Create fromUserDTO to avoid ts error
  // Some ugly ts hackery to set a specific id for the mock user
  mockUser.id = testUserId;
  AppUsersRepo.saveUser(mockUser);

  afterAll(async () => {
    // Clean up the mock user after tests

    // @ts-expect-error AppUsersRepo will always be MemoryUsersRepo
    await AppUsersRepo.clearForTesting(mockUser.id);
  });

  return mockUser;
};
