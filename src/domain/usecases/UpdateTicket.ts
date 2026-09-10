import { TicketRepository } from '../repositories/TicketRepository';
import { Ticket, TicketStatus } from '../entities/Ticket';
import { NotFoundError } from '../errors/NotFoundError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { UserRole } from '../entities/User';

export class UpdateTicket {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(
    ticketId: string,
    updates: Partial<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>>,
    userId: string,
    userRole: UserRole
  ): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError(ticketId);
    }

    // Vérifier les permissions
    const isAssignedToAnotherAgent = ticket.agent_id !== null && ticket.agent_id !== userId;

    if (userRole !== 'AGENT' || isAssignedToAnotherAgent) {
      throw new UnauthorizedError("Seul l'agent assigné peut modifier ce ticket.");
    }

    // Gérer les mises à jour spécifiques
    if (updates.status && !Object.values<TicketStatus>(['OUVERT', 'EN_COURS', 'TERMINE']).includes(updates.status)) {
      throw new Error('Invalid status.');
    }

    const updatedTicket = await this.ticketRepository.update(ticketId, {
      ...updates,
      agent_id: ticket.agent_id ?? userId,
      updatedAt: new Date(),
    });

    return updatedTicket;
  }
}