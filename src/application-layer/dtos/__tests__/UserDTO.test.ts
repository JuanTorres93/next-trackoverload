import { toUserDTO, fromUserDTO, UserDTO } from '../UserDTO';
import { User } from '@/domain/entities/user/User';
import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';

describe('UserDTO', () => {
  let user: User;
  let userDTO: UserDTO;

  beforeEach(() => {
    user = User.create(vp.validUserProps);
  });

  describe('toUserDTO', () => {
    beforeEach(() => {
      userDTO = toUserDTO(user);
    });

    it('should have a prop for each user getter', async () => {
      for (const getter of dto.userDTOProperties) {
        expect(userDTO).toHaveProperty(getter);
      }
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
        ...vp.validUserProps,
        customerId: undefined,
      });
      const dto = toUserDTO(userWithoutCustomerId);

      expect(dto.customerId).toBeUndefined();
    });
  });

  describe('fromUserDTO', () => {
    beforeEach(() => {
      userDTO = toUserDTO(user);
    });

    it('should convert UserDTO to User', () => {
      const reconstructedUser = fromUserDTO(userDTO);

      expect(reconstructedUser).toBeInstanceOf(User);
    });

    it('should convert ISO 8601 strings back to Date objects', () => {
      const reconstructedUser = fromUserDTO(userDTO);

      expect(reconstructedUser.createdAt).toBeInstanceOf(Date);
      expect(reconstructedUser.updatedAt).toBeInstanceOf(Date);
      expect(reconstructedUser.createdAt.getTime()).toBe(
        user.createdAt.getTime()
      );
      expect(reconstructedUser.updatedAt.getTime()).toBe(
        user.updatedAt.getTime()
      );
    });

    it('should maintain data integrity after round-trip conversion', () => {
      const reconstructedUser = fromUserDTO(userDTO);
      const reconvertedDTO = toUserDTO(reconstructedUser);

      expect(reconvertedDTO).toEqual(userDTO);
    });

    it('should handle user with customerId', () => {
      const reconstructedUser = fromUserDTO(userDTO);

      expect(reconstructedUser.customerId).toBe(user.customerId);
    });

    it('should handle user without customerId', () => {
      const userWithoutCustomerId = User.create({
        ...vp.validUserProps,
        customerId: undefined,
      });
      const dto = toUserDTO(userWithoutCustomerId);
      const reconstructed = fromUserDTO(dto);

      expect(reconstructed.customerId).toBeUndefined();
    });
  });
});
