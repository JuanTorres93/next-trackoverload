import * as dto from '@/../tests/dtoProperties';
import { User } from '@/domain/entities/user/User';
import * as userTestProps from '../../../../tests/createProps/userTestProps';
import { toUserDTO, UserDTO } from '../UserDTO';

describe('UserDTO', () => {
  let user: User;
  let userDTO: UserDTO;

  beforeEach(() => {
    user = User.create(userTestProps.validUserProps);
  });

  describe('toUserDTO', () => {
    beforeEach(() => {
      userDTO = toUserDTO(user);
    });

    it('should have a prop for each user getter except hashedPassword', async () => {
      for (const getter of dto.userDTOProperties) {
        expect(userDTO).toHaveProperty(getter);
      }

      // Ensure hashedPassword is not included in the DTO
      expect(userDTO).not.toHaveProperty('hashedPassword');
      expect(userDTO).not.toHaveProperty('password');
    });

    it('should convert User to UserDTO', () => {
      expect(userDTO).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        customerId: user.customerId,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    });

    it('should convert dates to ISO 8601 strings', () => {
      expect(typeof userDTO.createdAt).toBe('string');
      expect(typeof userDTO.updatedAt).toBe('string');
      expect(() => new Date(userDTO.createdAt)).not.toThrow();
      expect(() => new Date(userDTO.updatedAt)).not.toThrow();
    });

    it('should handle user without customerId', () => {
      const userWithoutCustomerId = User.create({
        ...userTestProps.validUserProps,
        customerId: undefined,
      });
      const dto = toUserDTO(userWithoutCustomerId);

      expect(dto.customerId).toBeUndefined();
    });
  });
});
