import { Uuidv4IdGenerator } from '../Uuidv4IdGenerator';

describe('Uuidv4IdGenerator', () => {
  let idGenerator: Uuidv4IdGenerator;

  beforeEach(() => {
    idGenerator = new Uuidv4IdGenerator();
  });

  it('should generate a valid UUID v4', () => {
    const uuid = idGenerator.generateId();
    const uuidV4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuidV4Regex.test(uuid)).toBe(true);
  });
});
