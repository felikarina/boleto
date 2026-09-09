import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities/User';
import { NotFoundError } from '../../errors/NotFoundError';

export class GetUserById {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Utilisateur');
    }
    return user;
  }
}