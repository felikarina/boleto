# 🚀 Boleto

Application de gestion des demandes de support permettant aux clients de créer des tickets, aux agents de les traiter et aux administrateurs de gérer les utilisateurs.

Ce README explique comment installer et lancer le projet en local (mode développeur), gérer la base de données et lancer les tests.

## 📋 Contenu rapide

* Backend : logique métier et accès aux données.
* Base de données : PostgreSQL fournie via Supabase.
* Authentification : Supabase Auth.
* Frontend : application web.
* Déploiement : Vercel.

## ⚙️ Prérequis

* Git
* Node.js (recommandé : Node 22)
* npm (fourni avec Node)
* Un compte Supabase
* Un compte Vercel

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

L'application utilise Supabase pour l'authentification et la base de données.

Créer un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_SUPABASE_URL="votre-url-supabase"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-cle-supabase"
```

Les valeurs sont disponibles dans les paramètres du projet Supabase.

Pour le déploiement sur Vercel, ces variables doivent également être ajoutées dans les variables d'environnement du projet.

⚠️ Ne commitez jamais votre fichier `.env.local` dans le repository.

## ▶️ Lancer le projet en local (mode complet)

Le projet utilise Supabase pour la base de données et l'authentification.

Pour lancer l'application en mode développement :

```bash
npm run dev
```
L'application sera accessible à l'adresse :

```text
http://localhost:3000
```

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

* `OPEN`
* `IN_PROGRESS`
* `DONE`

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

Si le schéma de la base de données est modifié, une migration doit être créée puis appliquée afin de conserver un historique des modifications.

## 🧪 Tests

Les tests permettent notamment de vérifier les règles métier et les droits d'accès de chaque utilisateur.

Les principaux cas testés sont :

* authentification d'un utilisateur
* création d'un ticket par un client
* consultation des tickets d'un client
* traitement d'un ticket par un agent
* passage d'un ticket à `DONE`
* contrôle des droits selon le rôle

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

* Erreur de variables d'environnement : vérifiez que le fichier `.env.local` existe à la racine du projet et que les noms des variables sont corrects.

* Erreur de connexion à la base de données : vérifiez que le projet Supabase est bien actif et accessible.

* Erreur avec Node.js : utilisez la version de Node.js recommandée par le projet.

* Erreur lors du build : lancez `npm run lint` afin d'identifier les éventuelles erreurs dans le code.

## 🗂️ Structure importante du repo

* `app/` : pages et routes de l'application
* `components/` : composants réutilisables
* `lib/` : configuration et fonctions utilisées par l'application
* `tests/` : tests du projet
* `public/` : fichiers statiques
* `.env.local` : variables d'environnement locales
* `package.json` : dépendances et scripts du projet
* `README.md` : documentation du projet
