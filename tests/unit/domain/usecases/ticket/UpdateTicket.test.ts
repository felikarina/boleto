import { UpdateTicket } from '../../../../../src/shared/domain/usecases/UpdateTicket';
import { TicketRepository } from '../../../../../src/shared/domain/repositories/TicketRepository';
import { Ticket } from '../../../../../src/shared/domain/entities/Ticket';
import { NotFoundError } from '../../../../../src/shared/domain/errors/NotFoundError';
import { UnauthorizedError } from '../../../../../src/shared/domain/errors/UnauthorizedError';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';


const mockTicketRepository: jest.Mocked<TicketRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findAllByUser: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('UpdateTicket Use Case', () => {
  const updateTicket = new UpdateTicket(mockTicketRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait mettre à jour un ticket avec succès', async () => {
    const mockTicket: Ticket = {
      id: 'ticket-000',
      title: 'Old Title',
      description: 'Old Description',
      status: 'OUVERT',
      client_id: 'user-000',
      agent_id: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTicket: Ticket = {
      ...mockTicket,
      title: 'New Title',
      agent_id: 'user-123',
      updatedAt: new Date(),
    };

    (mockTicketRepository.findById as jest.MockedFunction<TicketRepository['findById']>).mockResolvedValue(mockTicket);
    (mockTicketRepository.update as jest.MockedFunction<TicketRepository['update']>).mockResolvedValue(updatedTicket);

    const result = await updateTicket.execute(
      'ticket-123',
      { title: 'New Title' },
      'user-123',
      'AGENT'
    );

    expect(result).toEqual(updatedTicket);
    expect(mockTicketRepository.update).toHaveBeenCalledWith('ticket-123', {
      title: 'New Title',
      agent_id: 'user-123',
      updatedAt: expect.any(Date),
    });
  });

  it('devrait échouer si le ticket n\'existe pas', async () => {
    (mockTicketRepository.findById as jest.MockedFunction<TicketRepository['findById']>).mockResolvedValue(null);

    await expect(
      updateTicket.execute('ticket-123', { title: 'New Title' }, 'user-123', 'AGENT')
    ).rejects.toThrow(NotFoundError);
  });

  it('devrait échouer si le ticket est assigné à un autre agent_id', async () => {
    const mockTicket: Ticket = {
      id: 'ticket-123',
      title: 'Old Title',
      description: 'Old Description',
      status: 'OUVERT',
      client_id: 'user-456',
      agent_id: 'user-777',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (mockTicketRepository.findById as jest.MockedFunction<TicketRepository['findById']>).mockResolvedValue(mockTicket);

    await expect(
      updateTicket.execute('ticket-123', { title: 'New Title' }, 'user-123', 'AGENT')
    ).rejects.toThrow(UnauthorizedError);
  });
});