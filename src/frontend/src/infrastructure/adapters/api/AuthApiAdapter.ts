import { AuthRepository } from '../../../../../shared/domain/repositories/AuthRepository';
import { User, UserRole } from '../../../../../shared/domain/entities/User';
import { AuthTokens } from '../../../../../shared/domain/entities/AuthTokens';
import { API_BASE_URL } from '../../config/config';

export class AuthApiAdapter implements AuthRepository {
  async signup(name: string, email: string, password: string, role?: UserRole): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error ?? 'Signup failed');
    }
    return this.toUser(await response.json());
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error ?? 'Login failed');
    }
    const data = await response.json();
    return { token: data.token, user: this.toUser(data.user) };
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return this.toUser(await response.json());
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private toUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      password_hash: data.password_hash,
      role: data.role as UserRole,
      createdAt: new Date(data.createdAt),
    };
  }
}