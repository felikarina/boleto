import { TicketRepository } from '../../../domain/repositories/TicketRepository';
import { Ticket, TicketStatus } from '../../../domain/entities/Ticket';
import { supabase } from '../../config/supabase';

export class SupabaseTicketRepository implements TicketRepository {
  async create(ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        titre: ticket.title,
        description: ticket.description,
        statut: ticket.status,
        client_id: ticket.client_id,
        agent_id: ticket.agent_id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur pendant la création du ticket: ${error.message}`);
    }

    return {
      id: data.id_ticket,
      title: data.titre,
      description: data.description,
      status: data.statut as TicketStatus,
      client_id: data.client_id,
      agent_id: data.agent_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async findById(id: string): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('tickets')
      .select()
      .eq('id_ticket', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id_ticket,
      title: data.titre,
      description: data.description,
      status: data.statut as TicketStatus,
      client_id: data.client_id,
      agent_id: data.agent_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async findAllByUser(userId: string, role: string): Promise<Ticket[]> {
    let query = supabase.from('tickets').select();

    if (role === 'CLIENT') {
      query = query.eq('client_id', userId);
    } else if (role === 'AGENT') {
      query = query.or(`client_id.eq.${userId},agent_id.eq.${userId}`);
    }
    // Les ADMIN voient tous les tickets

    const { data, error } = await query;

    if (error) {
      throw new Error(`Erreur tickets: ${error.message}`);
    }

    return data.map((ticket) => ({
      id: ticket.id_ticket,
      title: ticket.titre,
      description: ticket.description,
      status: ticket.statut as TicketStatus,
      client_id: ticket.client_id,
      agent_id: ticket.agent_id,
      createdAt: new Date(ticket.created_at),
      updatedAt: new Date(ticket.updated_at),
    }));
  }

  async update(id: string, ticket: Partial<Ticket>): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .update({
        titre: ticket.title,
        description: ticket.description,
        statut: ticket.status,
        agent_id: ticket.agent_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id_ticket', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur en modifiant le ticket: ${error.message}`);
    }

    return {
      id: data.id_ticket,
      title: data.titre,
      description: data.description,
      status: data.statut as TicketStatus,
      client_id: data.client_id,
      agent_id: data.agent_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('tickets').delete().eq('id_ticket', id);
    if (error) {
      throw new Error(`Erreur en effaçant le ticket: ${error.message}`);
    }
  }
}