import { User } from '@/domain/entities/user/User';

export type UserDTO = {
  id: string;
  name: string;
  customerId?: string;
  createdAt: string;
  updatedAt: string;
};

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    customerId: user.customerId,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function fromUserDTO(dto: UserDTO): User {
  return User.create({
    id: dto.id,
    name: dto.name,
    customerId: dto.customerId,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
