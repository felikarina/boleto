import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';
import { setupSwagger } from '../../utils/swagger';
import ticketRouter from './routes/ticketRoutes';
import authRouter from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tickets', ticketRouter);
app.use('/api/auth', authRouter);
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Swagger
setupSwagger(app);

// Error handling
app.use(errorHandler);

// Export pour Vercel
const handler = serverless(app);
export { handler };
export default handler;

// Démarrer le serveur localement
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}