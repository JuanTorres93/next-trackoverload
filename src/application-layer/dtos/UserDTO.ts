import { User } from '@/domain/entities/user/User';

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  customerId?: string;
  subscriptionStatus?: string;
  subscriptionEndsAt?: string;
  hasValidSubscription?: boolean;
  createdAt: string;
  updatedAt: string;
};

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    customerId: user.customerId,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionEndsAt: user.subscriptionEndsAt?.toISOString(),
    hasValidSubscription: user.hasValidSubscription,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
