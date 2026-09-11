export type UserRole = 'CLIENT' | 'AGENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  createdAt: Date;
}