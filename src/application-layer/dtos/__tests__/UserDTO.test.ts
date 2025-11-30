import { beforeEach, describe, expect, it } from 'vitest';
import { toUserDTO, fromUserDTO, UserDTO } from '../UserDTO';
import { User } from '@/domain/entities/user/User';
import * as vp from '@/../tests/createProps';

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

    it('should convert User to UserDTO', () => {
      expect(userDTO).toEqual({
        id: user.id,
        name: user.name,
        customerId: user.customerId,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    });

    it('should have all required properties', () => {
      expect(userDTO).toHaveProperty('id');
      expect(userDTO).toHaveProperty('name');
      expect(userDTO).toHaveProperty('createdAt');
      expect(userDTO).toHaveProperty('updatedAt');
    });

    it('should convert dates to ISO 8601 strings', () => {
      expect(typeof userDTO.createdAt).toBe('string');
      expect(typeof userDTO.updatedAt).toBe('string');
      expect(() => new Date(userDTO.createdAt)).not.toThrow();
      expect(() => new Date(userDTO.updatedAt)).not.toThrow();
    });

    it('should include customerId when present', () => {
      expect(userDTO).toHaveProperty('customerId');
      expect(userDTO.customerId).toBe(user.customerId);
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
      expect(reconstructedUser.id).toBe(user.id);
      expect(reconstructedUser.name).toBe(user.name);
      expect(reconstructedUser.customerId).toBe(user.customerId);
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

    it('should preserve user name correctly', () => {
      const reconstructedUser = fromUserDTO(userDTO);

      expect(reconstructedUser.name).toBe('Test User');
    });
  });
});
