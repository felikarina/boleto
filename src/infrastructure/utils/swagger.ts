import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import fs from 'fs';
import path from 'path';

const specs = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../openapi.json'), 'utf8')
);

specs.servers = [
  {
    url: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
    description: process.env.VERCEL_URL ? 'Serveur déployé' : 'Serveur local',
  },
];

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};