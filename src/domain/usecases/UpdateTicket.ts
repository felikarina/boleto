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
    const isAssigned = ticket.agent_id === userId;

    if (userRole !== 'AGENT' || !isAssigned) {
      throw new UnauthorizedError("Seul l'agent assigné peut modifier ce ticket.");
    }

    // Gérer les mises à jour spécifiques
    if (updates.status && !Object.values<TicketStatus>(['OUVERT', 'EN_COURS', 'TERMINE']).includes(updates.status)) {
      throw new Error('Invalid status.');
    }

    // L'agent assigné ne peut pas réassigner le ticket lui-même.
    if (updates.agent_id) {
      delete updates.agent_id;
    }

    const updatedTicket = await this.ticketRepository.update(ticketId, {
      ...updates,
      updatedAt: new Date(),
    });

    return updatedTicket;
  }
}