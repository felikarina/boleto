import { User } from './User';

export interface AuthTokens {
  token: string;
  user: User;
}