import { Ticket } from '../entities/Ticket';

export interface TicketRepository {
  create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket>;
  findById(id: string): Promise<Ticket | null>;
  findAllByUser(userId: string, role: string): Promise<Ticket[]>;
  update(id: string, ticket: Partial<Ticket>): Promise<Ticket>;
  delete(id: string): Promise<void>;
}