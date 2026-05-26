import { User, UserCreateProps } from "../../src/domain/entities/user/User";
import { validUserProps } from "../createProps/userTestProps";
import { TestUsersRepo } from "../repos/TestUsersRepo";

export const createAndPersistTestUser = async (
  alternativeUserProps?: Partial<UserCreateProps>,
) => {
  const user = User.create({
    ...validUserProps,
    ...alternativeUserProps,
  });

  await TestUsersRepo.saveUser(user);

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
    TestUsersRepo.clearForTesting();
  });

  return mockUser;
};
