import { User, UserRole } from '../entities/User';

export interface UserRepository {
  create(name: string, email: string, password: string, role: UserRole): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}