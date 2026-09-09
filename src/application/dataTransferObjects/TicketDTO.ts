import { TicketStatus } from '../../domain/entities/Ticket';

export interface CreateTicketDTO {
  title: string;
  description: string;
}

export interface UpdateTicketDTO {
  title?: string;
  description?: string;
  statut?: TicketStatus;
  agent_id?: string;
}

export interface TicketResponseDTO {
  id: string;
  title: string;
  description: string;
  statut: TicketStatus;
  client_id: string;
  agent_id: string | null;
  createdAt: string;
  updatedAt: string;
}