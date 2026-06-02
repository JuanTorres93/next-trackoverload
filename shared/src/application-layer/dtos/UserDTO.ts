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
