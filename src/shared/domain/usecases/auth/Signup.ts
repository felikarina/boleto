import { UserRepository } from '../../repositories/UserRepository';
import { User, UserRole } from '../../entities/User';

export class Signup {
  constructor(private userRepository: UserRepository) {}

  async execute(name: string, email: string, password: string, role: UserRole = 'CLIENT'): Promise<User> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Utilisateur déjà créé.');
    }

    return this.userRepository.create(name, email, password, role);
  }
}