export interface AuthService {
  register(email: string, password: string): Promise<string>;
  login(email: string, password: string): Promise<string>;
  logout(userId: string): Promise<void>;
}
