# 🚀 Boleto

Application de gestion des demandes de support permettant aux clients de créer des tickets, aux agents de les traiter et aux administrateurs de gérer les utilisateurs.

Le backend est organisé selon une architecture hexagonale (aussi appelée architecture ports et adaptateurs). Le domaine et les cas d’usage restent indépendants d'Express, de Supabase et des détails de transport.

## 📋 Contenu rapide

* Domaine : entités, règles métier, erreurs et ports de persistance.
* Application : cas d’usage, services d’orchestration et DTO.
* Infrastructure : API HTTP Express, authentification JWT, Supabase et composition des dépendances.
* Documentation : spécification OpenAPI disponible via Swagger UI.

## ⚙️ Prérequis

* Git
* Node.js (recommandé : Node 22)
* npm (fourni avec Node)
* Un compte Supabase
* Un compte Vercel si l'API doit être déployée sur cette plateforme

## 📥 Cloner le dépôt

```bash
git clone https://github.com/felikarina/boleto.git
cd boleto
```

## 📦 Installer les dépendances

Installez les dépendances à la racine du repo :

```bash
npm install
```

## 🔧 Configuration des variables d'environnement

L'API utilise Supabase pour l'authentification et la persistance PostgreSQL. Créez un fichier `.env.local` à la racine du projet :


```env
NEXT_PUBLIC_SUPABASE_URL="votre-url-supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-cle-supabase"
JWT_SECRET="votre-secret-jwt"
PORT=3000
```

Les valeurs sont disponibles dans les paramètres du projet Supabase.

Pour le déploiement sur Vercel, ces variables doivent également être ajoutées dans les variables d'environnement du projet.

⚠️ Ne commitez jamais votre fichier `.env.local` dans le repository.

## ▶️ Lancer le projet en local

Le projet utilise Supabase pour la base de données et l'authentification.

En mode développement, le serveur est relancé automatiquement lorsque les fichiers TypeScript de `src/` changent :

```bash
npm run dev
```
L'application sera accessible à l'adresse :

```text
http://localhost:3000
```

La documentation interactive est disponible à l'adresse `http://localhost:3000/api-docs`.

Pour compiler puis lancer la version JavaScript :

```bash
npm run build
npm start
```

## 🧭 Architecture hexagonale

Le code est structuré autour d'un domaine indépendant des frameworks et des services externes :

```text
src/
├── domain/
│   ├── entities/       # Ticket, User et types métier
│   ├── errors/         # Erreurs métier
│   ├── repositories/   # Ports sortants de persistance
│   └── usecases/       # Règles et cas d'usage métier
├── application/
│   ├── dataTransferObjects/ # Contrats d'entrée et de sortie
│   └── services/            # Orchestration des cas d'usage
└── infrastructure/
	├── adapters/http/       # Adaptateur entrant Express, routes et middlewares
	├── adapters/supabase/   # Adaptateurs sortants de persistance
	├── config/              # Configuration et injection des dépendances
	└── utils/               # Swagger/OpenAPI
```

### Flux de dépendances

* Le **domaine** définit les entités (`Ticket`, `User`), les statuts, les erreurs, les interfaces `TicketRepository` et `UserRepository`, ainsi que les cas d'usage.
* La couche **application** reçoit les DTO, invoque les cas d'usage et transforme les entités en réponses API via `TicketService` et `AuthService`.
* L'**infrastructure** implémente les ports avec `SupabaseTicketRepository` et `SupabaseUserRepository`, expose les routes Express et configure les dépendances dans `container.ts`.
* Les adaptateurs HTTP dépendent des services applicatifs, tandis que le domaine ne dépend d'aucun adaptateur. Un nouvel adaptateur de persistance peut donc remplacer Supabase sans modifier les règles métier.

## 🗄️ Bases de données / Migrations

La base de données PostgreSQL est hébergée sur Supabase.

Le projet contient deux entités principales :

* `UTILISATEUR`
* `TICKET`

Les utilisateurs possèdent un rôle :

* `ADMIN`
* `CLIENT`
* `AGENT`

Les tickets possèdent un statut :

* `OUVERT`
* `EN_COURS`
* `TERMINE`

Les relations principales sont :

* un client peut créer plusieurs tickets ;
* un ticket appartient à un seul client ;
* un agent peut traiter plusieurs tickets ;
* un ticket peut être traité par zéro ou un agent.

Les clés étrangères permettent de relier les tickets aux utilisateurs.

Exemple :

```text
TICKET.client_id → UTILISATEUR.id
TICKET.agent_id  → UTILISATEUR.id
```

Les adaptateurs Supabase utilisent les tables `utilisateurs` et `tickets`. Si le schéma de la base de données est modifié, une migration doit être créée puis appliquée afin de conserver un historique des modifications.

## 🔌 API HTTP

Routes d'authentification :

* `POST /api/auth/signup` : créer un utilisateur.
* `POST /api/auth/login` : se connecter et obtenir un JWT.

Routes de tickets, protégées par `Authorization: Bearer <token>` :

* `POST /api/tickets` : créer un ticket.
* `GET /api/tickets` : lister les tickets accessibles selon le rôle.
* `GET /api/tickets/:id` : consulter un ticket.
* `PATCH /api/tickets/:id` : modifier un ticket selon les droits du rôle.
* `DELETE /api/tickets/:id` : supprimer un ticket selon les droits du rôle.

Routes de supervision :

* `GET /api/health` : vérifier que l'API répond.
* `GET /api/health/supabase` : vérifier l'accès à Supabase.

## 🧪 Tests

Les tests permettent notamment de vérifier les règles métier et les droits d'accès de chaque utilisateur.

Les principaux cas testés sont :

* authentification d'un utilisateur ;
* création et consultation des tickets ;
* traitement d'un ticket par un agent ;
* passage d'un ticket à `TERMINE` ;
* contrôle des droits selon le rôle.

Pour lancer les tests :

```bash
npm run test
```
Pour lancer les tests en mode watch :

```bash
npm run test:watch
```

## ⚠️ Dépannage rapide

* Erreur de connexion à Supabase : vérifiez les valeurs de `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

* Erreur de JWT : vérifiez que `JWT_SECRET` est défini et identique entre la création et la vérification des tokens.

* Erreur de variables d'environnement : vérifiez que le fichier `.env.local` existe à la racine du projet et que les noms des variables sont corrects.

* Erreur de connexion à la base de données : vérifiez que le projet Supabase est bien actif et accessible.

* Erreur avec Node.js : utilisez la version de Node.js recommandée par le projet.

* Erreur lors du build : lancez `npm run lint` afin d'identifier les éventuelles erreurs dans le code.

## 🗂️ Structure importante du repo

* `src/domain/` : coeur métier et ports ;
* `src/application/` : services et DTO ;
* `src/infrastructure/` : adaptateurs, configuration et serveur HTTP ;
* `tests/` : tests du projet ;
* `.env.local` : variables d'environnement locales ;
* `package.json` : dépendances et scripts ;
* `tsconfig.json` : configuration TypeScript ;
* `README.md` : documentation du projet.
