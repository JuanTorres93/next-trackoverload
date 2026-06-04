import { UserDTO } from "shared";

export const userTestProps = {
  name: "Test User",
  email: "test@test.com",
  plainPassword: "P@ssword123",
};

export function createUniqueUserProps() {
  const uniqueSuffix = crypto.randomUUID();

  return {
    name: `${userTestProps.name} ${uniqueSuffix}`,
    email: `test${uniqueSuffix}@test.com`,
    plainPassword: userTestProps.plainPassword,
  };
}

export async function createUserInTestBackend(
  backendService: any,
  overrides?: Partial<{
    name: string;
    email: string;
  }>,
) {
  const userProps = createUniqueUserProps();

  const request = {
    ...userProps,
    ...overrides,
  };

  const response = await backendService.createUser(
    request.name,
    request.plainPassword,
    request.email,
  );

  const user = response.data as UserDTO;

  return {
    user,
  };
}
