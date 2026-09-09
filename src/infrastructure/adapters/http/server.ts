import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSwagger } from '../../utils/swagger';
import ticketRouter from './routes/ticketRoutes';
import authRouter from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { supabase } from '../../config/supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tickets', ticketRouter);
app.use('/api/auth', authRouter);
app.get('/api/health/supabase', async (req, res) => {
  const { error } = await supabase.from('utilisateurs').select('*').limit(1);

  if (error) {
    console.error('Supabase health check failed:', error);
    return res.status(503).json({
      status: 'ERROR',
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
  }

  return res.status(200).json({ status: 'OK', service: 'supabase' });
});
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Swagger
setupSwagger(app);

// Error handling
app.use(errorHandler);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Export pour Vercel
export default app;