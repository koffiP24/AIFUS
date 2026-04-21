# AIFUS 2026

Application full-stack pour les festivites AIFUS 2026.

Le projet couvre :
- une vitrine publique des evenements,
- l'inscription / connexion des participants,
- la reservation du gala,
- l'achat de billets de tombola,
- un espace membre,
- un espace d'administration,
- une base MySQL pilotee via Prisma.

## Stack

- Frontend : React 19, Vite 8, React Router, Tailwind CSS 4, Axios
- Backend : Node.js, Express, Prisma, JWT, bcrypt, Nodemailer
- Base de donnees : MySQL 8 sur WAMP

## Structure du repo

```text
AIFUS/
|- frontend/                 # application React/Vite
|- backend/                  # API Express + Prisma
|- images/                   # assets bruts du projet
`- docs/
   |- ARCHITECTURE.md        # vue d'ensemble technique
   `- AUDIT_TECHNIQUE.md     # audit detaille fichier par fichier
```

## Scripts racine

Depuis la racine, vous pouvez maintenant piloter le projet sans changer de dossier :

```bash
npm run dev:frontend
npm run dev:backend
npm run build:frontend
npm run prisma:generate
npm run prisma:deploy
```

## Base MySQL WAMP

Le projet est maintenant configure pour utiliser la base locale WAMP :

- Nom de base : `aifus_festivites`
- Moteur : MySQL WAMP
- URL Prisma locale : `mysql://root:@localhost:3306/aifus_festivites`

La base a ete creee et les migrations Prisma ont ete appliquees.

Pour verifier manuellement dans WAMP / MySQL :

```sql
SHOW DATABASES LIKE 'aifus_festivites';
USE aifus_festivites;
SHOW TABLES;
```

Tables attendues :

- `_prisma_migrations`
- `user`
- `passwordreset`
- `inscriptiongala`
- `billettombola`
- `contactmessage`

## Prerequis

- Node.js 20+
- npm
- WAMP avec MySQL demarre sur `localhost:3306`

## Variables d'environnement

### Backend `backend/.env`

Le fichier local pointe deja sur MySQL WAMP. Les autres valeurs restent a adapter a votre environnement :

```env
DATABASE_URL="mysql://root:@localhost:3306/aifus_festivites"
JWT_SECRET=change-this-secret-in-production
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=AIFUS
```

### Frontend `frontend/.env`

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_BASE_URL=/api
```

Important :
- `GOOGLE_CLIENT_ID` et `VITE_GOOGLE_CLIENT_ID` doivent contenir le meme vrai client ID Google pour activer la connexion Google.
- Tant qu'un placeholder est present, le bouton Google reste volontairement desactive.

## Installation

### 1. Installer les dependances backend

```bash
cd backend
npm install
```

### 2. Installer les dependances frontend

```bash
cd frontend
npm install
```

Alternative depuis la racine :

```bash
npm run install:backend
npm run install:frontend
```

### 3. Generer Prisma et appliquer les migrations

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

## Lancement local

### Demarrer l'API

```bash
cd backend
npm run dev
```

API attendue sur :

- `http://localhost:5000`

### Demarrer le front

```bash
cd frontend
npm run dev
```

Application attendue sur :

- `http://localhost:5173`

Le frontend utilise un proxy Vite vers `/api`, donc il doit tourner en meme temps que le backend.

## Scripts utiles

### Backend

```bash
npm run dev
npm start
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Comptes et administration

Le role admin n'est pas attribue automatiquement.

Pour promouvoir un utilisateur existant :

```sql
UPDATE user SET role = 'ADMIN' WHERE email = 'votre-email@example.com';
```

## Etat actuel

Corrections appliquees :
- base Prisma branchee sur MySQL WAMP,
- base `aifus_festivites` creee,
- migrations Prisma appliquees,
- `autoprefixer` ajoute pour corriger le build frontend,
- flux Google corrige cote frontend avec composant `GoogleLogin`,
- routes manquantes `/conditions` et `/confidentialite` ajoutees,
- validations d'auth harmonisees,
- classes Tailwind dynamiques critiques remplacees dans l'admin.

Verifications effectuees :
- build frontend OK,
- verification syntaxique backend OK,
- tables MySQL creees OK.

## Documentation complementaire

- [Architecture](docs/ARCHITECTURE.md)
- [Audit technique](docs/AUDIT_TECHNIQUE.md)
