import { Request, Router } from 'express';
import { ticketService } from '../../../config/container';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { CreateTicketDTO, UpdateTicketDTO } from '../../../../application/dataTransferObjects/TicketDTO';
import { UserRole } from '../../../../domain/entities/User';

const router = Router();

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    role: UserRole;
  };
};

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Créer un nouveau ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTicketDTO'
 *     responses:
 *       201:
 *         description: Ticket créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketResponseDTO'
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    const ticket = await ticketService.createTicket(
      req.body as CreateTicketDTO,
      req.user.id
    );
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Lister les tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Ouvert, En cours, Termine]
 *         description: Filtrer par statut
 *     responses:
 *       200:
 *         description: Liste des tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tickets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TicketResponseDTO'
 *                 total:
 *                   type: integer
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    const { status } = req.query;
    let tickets = await ticketService.getTickets(req.user.id, req.user.role as UserRole);

    if (status) {
      tickets = tickets.filter((ticket) => ticket.statut === status);
    }

    res.json({ tickets, total: tickets.length });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Récupérer un ticket par ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du ticket
 *     responses:
 *       200:
 *         description: Ticket trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketResponseDTO'
 *       404:
 *         description: Ticket introuvable
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès interdit
 */
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    const ticket = await ticketService.getTicketById(
      req.params.id as string,
      req.user.role as UserRole
    );
    res.json(ticket);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tickets/{id}:
 *   patch:
 *     summary: Mettre à jour un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTicketDTO'
 *     responses:
 *       200:
 *         description: Ticket mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketResponseDTO'
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Ticket introuvable
 *       401:
 *         description: Non autorisé
 */
router.patch('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    const ticket = await ticketService.updateTicket(
      req.params.id as string,
      req.body as UpdateTicketDTO,
      req.user.id,
      req.user.role as UserRole
    );
    res.json(ticket);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Supprimer un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du ticket
 *     responses:
 *       204:
 *         description: Ticket supprimé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Ticket introuvable
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    await ticketService.deleteTicket(
      req.params.id as string,
      req.user.id,
      req.user.role as UserRole
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;