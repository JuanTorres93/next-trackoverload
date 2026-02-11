import { User } from '@/domain/entities/user/User';

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  customerId?: string;
  createdAt: string;
  updatedAt: string;
};

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    customerId: user.customerId,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
