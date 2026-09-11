import { CreateTicket } from '../../../../../src/shared/domain/usecases/CreateTicket';
import { TicketRepository } from '../../../../../src/shared/domain/repositories/TicketRepository';
import { Ticket } from '../../../../../src/shared/domain/entities/Ticket';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockTicketRepository: jest.Mocked<TicketRepository> = {
  create: jest.fn(),
  findById: jest.fn(),
  findAllByUser: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CreateTicket Use Case', () => {
  const createTicket = new CreateTicket(mockTicketRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait créer un ticket avec succès', async () => {
    const mockTicket: Ticket = {
      id: '123',
      title: 'Test Ticket',
      description: 'Test Description',
      status: 'OUVERT',
      client_id: 'user-123',
      agent_id: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTicketRepository.create.mockResolvedValue(mockTicket);


    const ticket = await createTicket.execute(
      'Test Ticket',
      'Test Description',
      'user-123'
    );

    expect(ticket).toEqual(mockTicket);
    expect(mockTicketRepository.create).toHaveBeenCalledWith({
      title: 'Test Ticket',
      description: 'Test Description',
      status: 'OUVERT',
      client_id: 'user-123',
      agent_id: null,
    });
  });

  it('devrait échouer si le titre est vide', async () => {
    await expect(
      createTicket.execute('', 'Test Description', 'user-123')
    ).rejects.toThrow('Titre et description requis.');
  });

  it('devrait échouer si la description est vide', async () => {
    await expect(
      createTicket.execute('Test Ticket', '', 'user-123')
    ).rejects.toThrow('Titre et description requis.');
  });
});