import { UserRepository } from '../../domain/repositories/UserRepository';
import { TicketRepository } from '../../domain/repositories/TicketRepository';
import { SupabaseUserRepository } from '../adapters/supabase/SupabaseUserRepository';
import { SupabaseTicketRepository } from '../adapters/supabase/SupabaseTicketRepository';
import { AuthService } from '../../application/services/AuthService';
import { TicketService } from '../../application/services/TicketService';

// Initialiser les repositories
const userRepository: UserRepository = new SupabaseUserRepository();
const ticketRepository: TicketRepository = new SupabaseTicketRepository();

// Initialiser les services
const authService = new AuthService(userRepository);
const ticketService = new TicketService(ticketRepository);

export { authService, ticketService, userRepository, ticketRepository };