import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../entities/User';

export class Login {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Identifiants non valides.');
    }

    // La vérification du mot de passe sera gérée par l'adapteur Supabase
    return { user, token: '' }; // Le token sera généré par l'adapteur
  }
}