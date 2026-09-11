import { UserRepository } from '../../../shared/domain/repositories/UserRepository';
import { User, UserRole } from '../../../shared/domain/entities/User';
import { supabase } from '../../config/supabase';
import bcrypt from 'bcryptjs';
import { ConflictError } from '../../../shared/domain/errors/ConflictError';

export class SupabaseUserRepository implements UserRepository {
  async create(nom: string, email: string, password: string, role: UserRole): Promise<User> {
    // Créer l'utilisateur dans Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        throw new ConflictError('Cette adresse email est déjà utilisée.');
      }
      throw new Error(`Error creating user: ${authError.message}`);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Ajouter le rôle dans la table `utilisateurs`
    const { data: profile, error: profileError } = await supabase
      .from('utilisateurs')
      .insert({
        id_utilisateur: authUser.user.id,
        nom,
        email,
        role,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (profileError) {
      await supabase.auth.admin.deleteUser(authUser.user.id);
      throw new Error(`Error creating profile: ${profileError.message}`);
    }

    return {
      id: profile.id_utilisateur,
      name: profile.nom,
      email: profile.email,
      password_hash: profile.password_hash,
      role: profile.role as UserRole,
      createdAt: new Date(profile.created_at),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data: profile, error } = await supabase
      .from('utilisateurs')
      .select()
      .eq('email', email)
      .maybeSingle();

    if (error || !profile) {
      return null;
    }

    return {
      id: profile.id_utilisateur,
      name: profile.nom,
      email: profile.email,
      password_hash: profile.password_hash,
      role: profile.role as UserRole,
      createdAt: new Date(profile.created_at),
    };
  }

  async findById(id: string): Promise<User | null> {
    const { data: profile, error } = await supabase
      .from('utilisateurs')
      .select()
      .eq('id_utilisateur', id)
      .maybeSingle();

    if (error || !profile) {
      return null;
    }

    return {
      id: profile.id_utilisateur,
      name: profile.nom,
      email: profile.email,
      password_hash: profile.password_hash,
      role: profile.role as UserRole,
      createdAt: new Date(profile.created_at),
    };
  }
}