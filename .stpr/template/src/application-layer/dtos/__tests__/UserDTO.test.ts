import { beforeEach, describe, expect, it } from 'vitest';

import { createTestUser } from '../../../../tests/createEntitiesTest/userCreate';
import { userDTOProperties } from '../../../../tests/dtoProperties/userDtoProperties';
import { User } from '../../../domain/entities/user/User';
import { UserDTO, toUserDTO, toUserEntity } from '../UserDTO';

describe('UserDTO', () => {
  let user: User;
  let userDTO: UserDTO;

  beforeEach(() => {
    user = createTestUser();
  });

  describe('toUserDTO', () => {
    beforeEach(() => {
      userDTO = toUserDTO(user);
    });

    it('should have a prop for each user getter except hashedPassword', async () => {
      for (const getter of userDTOProperties) {
        expect(userDTO).toHaveProperty(getter);
      }

      expect(userDTO).not.toHaveProperty('hashedPassword');
      expect(userDTO).not.toHaveProperty('password');

      for (const key in userDTO) {
        expect(key.toLowerCase()).not.toContain('pass');
      }
    });
  });

  describe('toUser', () => {
    it('should convert UserDTO back to User', async () => {
      const hashedPassword = 'hashedPassword';
      const userFromDTO = toUserEntity(userDTO, hashedPassword);

      expect(userFromDTO).toBeInstanceOf(User);
      expect(userFromDTO.id).toBe(user.id);
      expect(userFromDTO.email).toBe(user.email);
    });
  });
});
