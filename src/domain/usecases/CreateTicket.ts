import { TicketRepository } from '../repositories/TicketRepository';
import { Ticket } from '../entities/Ticket';

export class CreateTicket {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(
    title: string,
    description: string,
    client_id: string
  ): Promise<Ticket> {
    if (!title || !description) {
      throw new Error('Titre et description requis.');
    }

    const ticket = await this.ticketRepository.create({
      title,
      description,
      status: 'OUVERT',
      client_id,
      agent_id: null,
    });

    return ticket;
  }
}