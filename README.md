# 🚀 Boleto

Boleto est une application de gestion de tickets de support, pensée pour séparer clairement le cœur métier de l’infrastructure technique. Le backend suit une architecture hexagonale : le domaine et les cas d’usage sont indépendants d’Express, de Supabase et des détails de transport.

Le projet expose une API REST sécurisée, gère l’authentification JWT et s’appuie sur Supabase pour la persistance et l’authentification utilisateur.

## ✨ Fonctionnalités

- Inscription et connexion d’utilisateurs
- Authentification via JWT
- Création, consultation, mise à jour et suppression de tickets
- Rôles : CLIENT, AGENT, ADMIN
- Contrôle d’accès selon le rôle
- API documentée avec Swagger UI
- Frontend statique servi par le serveur Express
- Déploiement compatible Vercel

## 🏗️ Stack technique

- Node.js / TypeScript
- Express
- Supabase JavaScript client
- JWT (jsonwebtoken)
- PostgreSQL via Supabase
- Swagger/OpenAPI
- Jest pour les tests unitaires
- Vercel-ready

## 📁 Structure du projet

```text
boleto/
├── api/
│   └── index.js                 # Point d’entrée Vercel
├── src/
│   ├── frontend/
│   │   ├── public/
│   │   │   └── index.html       # Frontend statique
│   │   └── src/
│   │       └── main.ts          # Logiciel frontend
│   ├── infrastructure/
│   │   ├── adapters/
│   │   │   ├── http/
│   │   │   │   ├── middlewares/
│   │   │   │   ├── routes/
│   │   │   │   └── server.ts
│   │   │   └── supabase/
│   │   ├── config/
│   │   │   ├── container.ts
│   │   │   ├── supabase.ts
│   │   │   └── ...
│   │   └── utils/
│   │       └── swagger.ts
│   └── shared/
│       ├── application/
│       │   ├── dto/
│       │   └── services/
│       ├── domain/
│       │   ├── entities/
│       │   ├── errors/
│       │   ├── repositories/
│       │   └── usecases/
│       └── ...
├── tests/
│   └── unit/
│       └── domain/
│           └── usecases/
│               └── ticket/
├── openapi.json                 # Spécification OpenAPI
├── package.json
├── tsconfig.json
├── tsconfig.frontend.json
├── vercel.json
├── README.md
└── ...
```

## 🧭 Architecture

### Couche domaine

Contient les règles métier, les entités et les ports :

- `User`
- `Ticket`
- `UserRole`
- `TicketStatus`
- repositories (`UserRepository`, `TicketRepository`)
- use cases (`Signup`, `Login`, `CreateTicket`, `UpdateTicket`, etc.)

### Couche application

La couche applicative orchestre les cas d’usage et transforme les entités en DTO :

- `AuthService`
- `TicketService`
- DTO des utilisateurs et des tickets

### Couche infrastructure

Implémente les adaptateurs externes :

- `Express` pour les routes HTTP
- `Supabase` pour les repositories et l’authentification
- Swagger pour la documentation OpenAPI
- injection de dépendances via `container.ts`

## ⚙️ Prérequis

- Git
- Node.js 20+ ou 22 recommandé
- npm
- Compte Supabase actif
- Optionnel : compte Vercel pour le déploiement

## 📦 Installation

```bash
git clone https://github.com/felikarina/boleto.git
cd boleto
npm install
```

## 🔐 Variables d’environnement

Créez un fichier `.env` ou `.env.local` à la racine du projet avec les variables suivantes :

```env
SUPABASE_URL="https://votre-projet.supabase.co"
SUPABASE_ANON_KEY="votre-cle-anon-supabase"
JWT_SECRET="votre-secret-jwt"
PORT=3000
```

### Détails

- `SUPABASE_URL` : URL du projet Supabase
- `SUPABASE_ANON_KEY` : clé publique de votre projet Supabase
- `JWT_SECRET` : clé utilisée pour signer et vérifier les tokens JWT
- `PORT` : port local du serveur Express

> Ne commitez jamais les fichiers `.env` ou `.env.local`.

## ▶️ Lancer le projet en local

### Mode développement

```bash
npm run dev
```

Le serveur démarre sur :

```text
http://localhost:3000
```

La documentation Swagger est accessible ici :

```text
http://localhost:3000/api-docs
```

Le frontend static est servi sur :

- `/login`
- `/signup`
- `/tickets`

### Build de production

```bash
npm run build
npm start
```

## 🔌 API REST

### Authentification

- `POST /api/auth/signup` : créer un utilisateur
- `POST /api/auth/login` : se connecter et obtenir un JWT
- `GET /api/auth/me` : récupérer l’utilisateur connecté (authentification requise)

### Tickets

Les routes tickets sont protégées par le middleware d’authentification et nécessitent un header :

```http
Authorization: Bearer <token>
```

- `POST /api/tickets` : créer un ticket
- `GET /api/tickets` : lister les tickets accessibles selon le rôle
- `GET /api/tickets/:id` : récupérer un ticket
- `PATCH /api/tickets/:id` : mettre à jour un ticket
- `DELETE /api/tickets/:id` : supprimer un ticket

### Santé

- `GET /api/health` : vérifie que l’API répond

## 🧪 Tests

Le projet contient des tests unitaires sur les cas d’usage métier, notamment :

- création de tickets
- mise à jour de tickets
- règles de validation métier
- permissions selon le rôle utilisateur

Lancer les tests :

```bash
npm run test
```

Mode watch :

```bash
npm run test:watch
```

## ☁️ Déploiement Vercel

Le projet est prêt pour Vercel via la configuration de `vercel.json` et le point d’entrée `api/index.js`.

Les variables d’environnement Supabase et JWT doivent être ajoutées dans le dashboard Vercel.

```bash
npm run vercel-build
```

## 🛠️ Scripts disponibles

Dans `package.json` :

- `npm run dev` : démarrage local avec compilation TypeScript en watch
- `npm run build` : compile le backend TypeScript et le frontend
- `npm run build:frontend` : bundle le frontend avec esbuild
- `npm start` : démarre le serveur compilé
- `npm test` : exécute la suite Jest
- `npm run test:watch` : lance Jest en mode watch
- `npm run vercel-build` : build utilisé pour Vercel

## ⚠️ Dépannage rapide

- Erreur Supabase : vérifier `SUPABASE_URL`, `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY`
- Erreur JWT : vérifier la présence de `JWT_SECRET` et sa cohérence
- Erreur 401 : vérifier le header `Authorization: Bearer <token>`
- Erreur 403 : vérifier le rôle de l’utilisateur par rapport aux permissions
- Erreur de build : vérifier la version de Node et relancer `npm install`

## 📌 Rôles métier

Les rôles disponibles côté application sont :

- `CLIENT`
- `AGENT`
- `ADMIN`

Les statuts de ticket sont :

- `OUVERT`
- `EN_COURS`
- `TERMINE`

## 🔎 À retenir

Boleto est un exemple d’architecture hexagonale appliquée à une API de support : le code métier reste autonome, les adaptateurs externes sont encapsulés et l’API HTTP ne dépend que des services applicatifs, jamais directement du détail technique de la persistance.

---

Pour toute contribution, il suffit de créer une branche, appliquer les changements et lancer les tests avant ouverture d’une PR.
