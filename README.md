<div align="center">

# 7Pret

**Application de planification de repas**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Hono](https://img.shields.io/badge/Hono-4.11-E36002?logo=hono)](https://hono.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7.3-2D3748?logo=prisma)](https://www.prisma.io/)
[![Bun](https://img.shields.io/badge/Bun-latest-FBF0DF?logo=bun)](https://bun.sh/)

[Fonctionnalites](#fonctionnalites) • [Installation](#installation) • [Utilisation](#utilisation) • [API](#documentation-api) • [Contribution](#contribution)

</div>

---

## A propos

**7Pret** est une application fullstack de planification de repas permettant aux utilisateurs de parcourir un catalogue de recettes, creer leurs propres recettes personnalisees et organiser leur planning de repas pour la semaine.

## Fonctionnalites

- **Authentification securisee** - Inscription et connexion avec email/mot de passe
- **Catalogue de recettes** - Parcourir et rechercher des recettes certifiees
- **Recettes personnalisees** - Creer, modifier et supprimer vos propres recettes
- **Planning hebdomadaire** - Organiser vos repas par jour et par creneau (dejeuner/diner)
- **Liste de courses** - Generation automatique basee sur votre planning
- **Interface responsive** - Fonctionne sur desktop et mobile

## Stack technique

### Frontend
| Technologie | Description |
|-------------|-------------|
| [React 19](https://react.dev/) | Bibliotheque UI |
| [React Router 7](https://reactrouter.com/) | Routing client |
| [Vite 7](https://vite.dev/) | Build tool & dev server |
| [TypeScript](https://www.typescriptlang.org/) | Typage statique |

### Backend
| Technologie | Description |
|-------------|-------------|
| [Hono](https://hono.dev/) | Framework web ultrarapide |
| [Prisma](https://www.prisma.io/) | ORM & migrations |
| [PostgreSQL](https://www.postgresql.org/) | Base de donnees |
| [Better Auth](https://www.better-auth.com/) | Authentification |
| [Zod](https://zod.dev/) | Validation de schemas |

### Outils
| Technologie | Description |
|-------------|-------------|
| [Bun](https://bun.sh/) | Runtime & package manager |
| [Biome](https://biomejs.dev/) | Linter & formatter |
| [Lefthook](https://github.com/evilmartians/lefthook) | Git hooks |
| [GitHub Actions](https://github.com/features/actions) | CI/CD |

## Prerequis

- [Bun](https://bun.sh/) >= 1.0
- [PostgreSQL](https://www.postgresql.org/) >= 14
- [Node.js](https://nodejs.org/) >= 20 (pour certains outils)

## Installation

### 1. Cloner le repository

```bash
git clone https://github.com/devZenta/7Pret.git
cd 7Pret
```

### 2. Installer les dependances

```bash
bun install
```

### 3. Configurer les variables d'environnement

Copier le fichier d'exemple et renseigner les valeurs :

```bash
cp .env.example .env
```

```env
# Base de donnees PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/7pret?schema=public"

# Better Auth
BETTER_AUTH_SECRET="votre-secret-genere-aleatoirement"
BETTER_AUTH_URL="http://localhost:5173"
```

> **Tip** : Generez un secret securise avec `openssl rand -base64 32`

### 4. Initialiser la base de donnees

```bash
# Generer le client Prisma
bunx --bun prisma generate

# (Optionnel) Peupler avec des donnees de test
bunx prisma db seed
```

## Utilisation

### Developpement

Lance le serveur frontend (Vite) et backend (Hono) simultanement :

```bash
bun dev
```

- Frontend : http://localhost:5173
- Backend API : http://localhost:3000
- Swagger UI : http://localhost:3000/swagger

### Production

```bash
# Build
bun run build

# Start
bun run start
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `bun run dev` | Lance le mode developpement (client + serveur) |
| `bun run dev:client` | Lance uniquement le frontend Vite |
| `bun run dev:server` | Lance uniquement le backend Hono |
| `bun run build` | Build de production |
| `bun run start` | Demarre le serveur de production |
| `bun run format` | Formate le code avec Biome |
| `bun run lint` | Verifie le code avec Biome |
| `bun run typecheck` | Verifie les types TypeScript |
| `bun run check` | Lint + format check |

## Documentation API

L'API REST est documentee avec OpenAPI/Swagger. En mode developpement, accedez a :

```
http://localhost:3000/swagger
```

### Endpoints principaux

| Methode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/sign-up` | Inscription |
| `POST` | `/api/auth/sign-in` | Connexion |
| `GET` | `/api/recipes` | Liste des recettes |
| `GET` | `/api/recipes/:id` | Detail d'une recette |
| `GET` | `/api/custom-recipes` | Recettes personnalisees |
| `POST` | `/api/custom-recipes` | Creer une recette |
| `PUT` | `/api/custom-recipes/:id` | Modifier une recette |
| `DELETE` | `/api/custom-recipes/:id` | Supprimer une recette |
| `GET` | `/api/planning` | Planning de l'utilisateur |
| `POST` | `/api/planning` | Ajouter au planning |
| `DELETE` | `/api/planning/:id` | Supprimer du planning |

## Structure du projet

```
7Pret/
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
├── prisma/
│   ├── migrations/        # Migrations de base de donnees
│   ├── schema.prisma      # Schema de la base de donnees
│   └── seed.ts            # Script de seed
├── server/
│   ├── middleware/        # Middleware d'authentification
│   ├── routes/            # Routes API (auth, recipes, planning)
│   ├── schemas/           # Schemas Zod pour validation
│   ├── services/          # Logique metier
│   └── index.ts           # Point d'entree du serveur
├── src/
│   ├── components/        # Composants React reutilisables
│   ├── lib/               # Utilitaires (auth, api-client, prisma)
│   ├── pages/             # Pages de l'application
│   │   ├── Catalogue/     # Catalogue de recettes
│   │   ├── CreateRecipe/  # Creation de recette
│   │   ├── Home/          # Page d'accueil
│   │   ├── Login/         # Connexion
│   │   ├── Planning/      # Planning hebdomadaire
│   │   ├── Settings/      # Parametres utilisateur
│   │   ├── ShoppingList/  # Liste de courses
│   │   └── Signup/        # Inscription
│   ├── App.tsx            # Router principal
│   └── main.tsx           # Point d'entree React
├── biome.json             # Configuration Biome
├── lefthook.yml           # Configuration Git hooks
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Schema de la base de donnees

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│    User     │────<│   Session   │     │    Recipe    │
├─────────────┤     ├─────────────┤     ├──────────────┤
│ id          │     │ id          │     │ id           │
│ name        │     │ token       │     │ name         │
│ email       │     │ expiresAt   │     │ type         │
│ image       │     │ userId (FK) │     │ cuisine      │
│ createdAt   │     └─────────────┘     │ difficulty   │
│ updatedAt   │                         │ ingredients  │
└─────────────┘                         │ steps        │
      │                                 └──────────────┘
      │
      ├────<┌───────────────┐
      │     │ CustomRecipe  │
      │     ├───────────────┤
      │     │ id            │
      │     │ userId (FK)   │
      │     │ name          │
      │     │ ingredients   │
      │     │ steps         │
      │     └───────────────┘
      │
      └────<┌───────────────┐
            │ MealPlanning  │
            ├───────────────┤
            │ id            │
            │ userId (FK)   │
            │ date          │
            │ slot          │
            │ recipeId      │
            │ source        │
            └───────────────┘
```

## Deploiement

Le projet est configure pour un deploiement sur [Railway](https://railway.app/) :

```toml
# nixpacks.toml
[phases.build]
cmds = ["bun run build"]

[start]
cmd = "bun run start"
```

### Variables d'environnement en production

- `DATABASE_URL` - URL de connexion PostgreSQL
- `BETTER_AUTH_SECRET` - Secret pour les sessions
- `BETTER_AUTH_URL` - URL de l'application deployee

## Contribution

Les contributions sont les bienvenues ! Merci de suivre ces etapes :

1. Fork le projet
2. Creer une branche (`git checkout -b feat/ma-fonctionnalite`)
3. Commit avec [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m "feat: ajout de ma fonctionnalite"`)
4. Push la branche (`git push origin feat/ma-fonctionnalite`)
5. Ouvrir une Pull Request

### Conventions de commit

Le projet utilise les Conventional Commits :

- `feat:` - Nouvelle fonctionnalite
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage
- `refactor:` - Refactorisation
- `test:` - Tests
- `chore:` - Maintenance

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de details.

---

<div align="center">

**[devZenta](https://github.com/devZenta)**

</div>
