import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSwagger } from '../../utils/swagger';
import ticketRouter from './routes/ticketRoutes';
import authRouter from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

dotenv.config();

const app = express();
const globalLimiter = rateLimit({
  windowMs: 1000,
  max: 10,
  message: 'Trop de requêtes, veuillez réessayer plus tard.'
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet())
app.use(globalLimiter);

const frontendPublicPath = path.resolve(__dirname, '../../../../src/frontend/public');
const frontendBuildPath = path.resolve(__dirname, '../../../../dist/frontend');
app.use(express.static(frontendPublicPath));
app.use(express.static(frontendBuildPath));

app.get(['/login', '/signup', '/tickets'], (req, res) => {
  res.sendFile(path.join(frontendPublicPath, 'index.html'));
});

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
export { app };
export default app;

// Démarrer le serveur localement
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}