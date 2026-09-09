import { TicketRepository } from '../../domain/repositories/TicketRepository';
import { CreateTicket } from '../../domain/usecases/CreateTicket';
import { GetTickets } from '../../domain/usecases/GetTicket';
import { UpdateTicket } from '../../domain/usecases/UpdateTicket';
import { DeleteTicket } from '../../domain/usecases/DeleteTicket';
import {
  CreateTicketDTO,
  UpdateTicketDTO,
  TicketResponseDTO,
} from '../dataTransferObjects/TicketDTO';
import { UserRole } from '../../domain/entities/User';
import { NotFoundError } from '../../domain/errors/NotFoundError';

export class TicketService {
  private ticketRepository: TicketRepository;
  private createTicketUseCase: CreateTicket;
  private getTicketsUseCase: GetTickets;
  private updateTicketUseCase: UpdateTicket;
  private deleteTicketUseCase: DeleteTicket;

  constructor(ticketRepository: TicketRepository) {
    this.ticketRepository = ticketRepository;
    this.createTicketUseCase = new CreateTicket(ticketRepository);
    this.getTicketsUseCase = new GetTickets(ticketRepository);
    this.updateTicketUseCase = new UpdateTicket(ticketRepository);
    this.deleteTicketUseCase = new DeleteTicket(ticketRepository);
  }

  async createTicket(dto: CreateTicketDTO, userId: string): Promise<TicketResponseDTO> {
    const ticket = await this.createTicketUseCase.execute(dto.title, dto.description, userId);
    return this.toDTO(ticket);
  }

  async getTickets(userId: string, role: UserRole): Promise<TicketResponseDTO[]> {
    const tickets = await this.getTicketsUseCase.execute(userId, role);
    return tickets.map(this.toDTO);
  }

  async getTicketById(ticketId: string, role: UserRole): Promise<TicketResponseDTO> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError(ticketId);
    }
    return this.toDTO(ticket);
  }

  async updateTicket(
    ticketId: string,
    dto: UpdateTicketDTO,
    userId: string,
    role: UserRole
  ): Promise<TicketResponseDTO> {
    const ticket = await this.updateTicketUseCase.execute(
      ticketId,
      { ...dto, status: dto.statut },
      userId,
      role
    );
    return this.toDTO(ticket);
  }

  async deleteTicket(ticketId: string, userId: string, role: UserRole): Promise<void> {
    await this.deleteTicketUseCase.execute(ticketId, userId, role);
  }

  private toDTO(ticket: any): TicketResponseDTO {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      statut: ticket.status,
      client_id: ticket.client_id,
      agent_id: ticket.agent_id,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    };
  }
}