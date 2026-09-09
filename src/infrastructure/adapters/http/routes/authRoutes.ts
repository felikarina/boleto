import { Router } from 'express';
import { authService } from '../../../config/container';
import { supabase, supabaseAuth } from '../../../config/supabase';
import { SignupDTO, LoginDTO } from '../../../../application/dataTransferObjects/UserDTO';
import jwt from 'jsonwebtoken';

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupDTO'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDTO'
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */
router.post('/signup', async (req, res, next) => {
  try {
    const user = await authService.signup(req.body as SignupDTO);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDTO'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UserResponseDTO'
 *                 token:
 *                   type: string
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body as LoginDTO;

    // Authentification via Supabase
    const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    // Récupérer le rôle depuis la table `utilisateurs`
    const { data: profile, error: profileError } = await supabase
      .from('utilisateurs')
      .select('role')
      .eq('email', email)
      .maybeSingle();

    if (profileError || !profile) {
      console.error('Profile utilisateur introuvable:', profileError);
      return res.status(401).json({
        error: 'Profil utilisateur introuvable.',
        ...(profileError && { details: profileError.message, code: profileError.code }),
      });
    }

    // Générer un token JWT
    const JWT_SECRET = process.env.JWT_SECRET!;
    const token = jwt.sign(
      { userId: authData.user.id, role: profile.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Récupérer l'utilisateur via le service
    const user = await authService.getUserById(authData.user.id);

    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

export default router;