export type TicketStatus = 'OUVERT' | 'EN_COURS' | 'TERMINE';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  client_id: string;
  agent_id: string | null;
}