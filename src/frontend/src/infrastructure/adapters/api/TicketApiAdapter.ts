import { TicketRepository } from '../../../../../shared/domain/repositories/TicketRepository';
import { Ticket, TicketStatus } from '../../../../../shared/domain/entities/Ticket';
import { API_BASE_URL } from '../../config/config';

export class TicketApiAdapter implements TicketRepository {
  async findById(id: string): Promise<Ticket | null> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch ticket');

    return this.toTicket(await response.json());
  }

  findAllByUser(userId: string, role: string): Promise<Ticket[]> {
    return this.getAll(userId, role);
  }
  async create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(ticket),
    });
    if (!response.ok) throw new Error('Failed to create ticket');
    return this.toTicket(await response.json());
  }

  async getAll(userId: string, role: string): Promise<Ticket[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch tickets');
    const data = await response.json();
    return data.tickets.map(this.toTicket);
  }

  async getById(ticketId: string): Promise<Ticket> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch ticket');
    return this.toTicket(await response.json());
  }

  async update(ticketId: string, ticket: Partial<Ticket>): Promise<Ticket> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(ticket),
    });
    if (!response.ok) throw new Error('Failed to update ticket');
    return this.toTicket(await response.json());
  }

  async delete(ticketId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error ?? 'Failed to delete ticket');
    }
  }

  private toTicket(data: any): Ticket {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: (data.status ?? data.statut) as TicketStatus,
      client_id: data.client_id ?? data.createdBy,
      agent_id: data.agent_id ?? data.assignedTo ?? null,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}