import { User, UserRole } from '../entities/User';
import { AuthTokens } from '../entities/AuthTokens';

export interface AuthRepository {
  signup(name: string, email: string, password: string, role?: UserRole): Promise<User>;
  login(email: string, password: string): Promise<AuthTokens>;
  getCurrentUser(): Promise<User | null>;
  logout(): Promise<void>;
}