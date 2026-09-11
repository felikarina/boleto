import { TicketRepository } from '../repositories/TicketRepository';
import { NotFoundError } from '../errors/NotFoundError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { UserRole } from '../entities/User';

export class DeleteTicket {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(ticketId: string, userId: string, userRole: UserRole): Promise<void> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError(ticketId);
    }

    // Seul un ADMIN peut supprimer un ticket
    const isAdmin = userRole === 'ADMIN';

    if (!isAdmin) {
      throw new UnauthorizedError("Vous n'avez pas la permission de supprimer ce ticket.");
    }

    await this.ticketRepository.delete(ticketId);
  }
}