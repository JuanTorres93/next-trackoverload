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
