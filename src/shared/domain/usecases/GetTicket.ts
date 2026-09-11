import { TicketRepository } from '../repositories/TicketRepository';
import { Ticket } from '../entities/Ticket';
import { UserRole } from '../entities/User';

export class GetTickets {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(userId: string, role: UserRole): Promise<Ticket[]> {
    return this.ticketRepository.findAllByUser(userId, role);
  }
}