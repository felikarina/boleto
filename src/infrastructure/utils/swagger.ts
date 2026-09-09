import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

const routePatterns = [
  path.join(process.cwd(), 'src/infrastructure/adapters/http/routes/*.ts'),
  path.join(__dirname, '../adapters/http/routes/*.js'),
].map((routePattern) => routePattern.replace(/\\/g, '/'));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Boleto',
      version: '1.0.0',
      description: 'Appli pour la gestion des tickets de support',
    },
    servers: [
      {
        url: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000',
        description: process.env.VERCEL_URL ? 'Serveur déployé' : 'Serveur local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Users
        SignupDTO: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Client Test' },
            email: { type: 'string', format: 'email', example: 'agent@boleto.com' },
            password: { type: 'string', example: 'password123' },
            role: { type: 'string', enum: ['CLIENT', 'AGENT', 'ADMIN'], example: 'AGENT' },
          },
        },
        LoginDTO: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'agent@boleto.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        UserResponseDTO: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            email: { type: 'string', format: 'email', example: 'agent@boleto.com' },
            role: { type: 'string', enum: ['CLIENT', 'AGENT', 'ADMIN'], example: 'AGENT' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-09-09T10:00:00Z' },
          },
        },

        // Tickets
        CreateTicketDTO: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            title: { type: 'string', example: "Problème d'imprimante" },
            description: { type: 'string', example: 'Je ne peux pas imprimer une feuille.' },
          },
        },
        UpdateTicketDTO: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Nouveau titre' },
            description: { type: 'string', example: 'Nouvelle description' },
            status: { type: 'string', enum: ['Ouvert', 'En cours', 'Terminé'], example: 'En cours' },
            agent_id: { type: 'string', format: 'uuid', example: '456e7890-1234-5678-90ab-cdef12345678' },
          },
        },
        TicketResponseDTO: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            title: { type: 'string', example: "Problème d'imprimante" },
            description: { type: 'string', example: 'Je ne peux pas imprimer une feuille.' },
            status: { type: 'string', enum: ['Ouvert', 'En cours', 'Terminé'], example: 'Ouvert' },
            client_id: { type: 'string', format: 'uuid', example: '456e7890-1234-5678-90ab-cdef12345678' },
            agent_id: { type: 'string', format: 'uuid', nullable: true, example: null },
            createdAt: { type: 'string', format: 'date-time', example: '2026-09-09T10:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2026-09-09T10:00:00Z' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Message d\'erreur' },
          },
        },
      },
    },
  },
  apis: routePatterns,
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};