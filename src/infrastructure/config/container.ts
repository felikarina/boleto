import { UserRepository } from '../../shared/domain/repositories/UserRepository';
import { TicketRepository } from '../../shared/domain/repositories/TicketRepository';
import { SupabaseUserRepository } from '../adapters/supabase/SupabaseUserRepository';
import { SupabaseTicketRepository } from '../adapters/supabase/SupabaseTicketRepository';
import { AuthService } from '../../shared/application/services/AuthService';
import { TicketService } from '../../shared/application/services/TicketService';

// Initialiser les repositories
const userRepository: UserRepository = new SupabaseUserRepository();
const ticketRepository: TicketRepository = new SupabaseTicketRepository();

// Initialiser les services
const authService = new AuthService(userRepository);
const ticketService = new TicketService(ticketRepository);

export { authService, ticketService, userRepository, ticketRepository };