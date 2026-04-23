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
npm run prisma:generate:v2
npm run prisma:validate:v2
npm run seed:v2
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
GOOGLE_CLIENT_IDS=
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

### Frontend `frontend/.env`

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_BASE_URL=/api
```

Important :
- `GOOGLE_CLIENT_ID` et `VITE_GOOGLE_CLIENT_ID` doivent contenir le meme vrai client ID Google pour activer la connexion Google.
- `GOOGLE_CLIENT_IDS` est optionnel cote backend et permet d'autoriser plusieurs audiences Google sous forme de liste separee par des virgules.
- apres toute modification de `backend/.env` ou `frontend/.env`, il faut redemarrer le serveur Express et le serveur Vite.
- la recuperation de mot de passe passe maintenant par email avec un code aleatoire a 6 chiffres.
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
- classes Tailwind dynamiques critiques remplacees dans l'admin,
- nouveau coeur billetterie `v2` ajoute en parallele sur MySQL avec Prisma dedie et routes `/api/v2`.

Verifications effectuees :
- build frontend OK,
- verification syntaxique backend OK,
- tables MySQL creees OK.

## Billetterie V2

Un nouveau coeur billetterie a ete ajoute sans casser l'API historique.

Pieces ajoutees :

- schema Prisma dedie : `backend/prisma/schema.mysql.prisma`
- migration SQL dediee : `backend/prisma/migrations_v2/20260421143000_ticketing_core/migration.sql`
- SQL de rattrapage si base partiellement initialisee : `backend/prisma/migrations_v2/20260421150000_ticketing_core_recovery.sql`
- seed SQL catalogue : `backend/prisma/seeds_v2/ticketing_core.sql`
- client Prisma dedie : `backend/src/generated/prisma-next-mysql`
- nouvelles routes : `backend/src/modules/v2/*`

Endpoints exposes :

- `POST /api/v2/auth/register`
- `POST /api/v2/auth/login`
- `POST /api/v2/auth/refresh`
- `POST /api/v2/auth/logout`
- `GET /api/v2/auth/me`
- `GET /api/v2/events`
- `GET /api/v2/events/:slug`
- `GET /api/v2/ticket-types`
- `POST /api/v2/orders/preview`
- `POST /api/v2/orders`
- `GET /api/v2/orders/:reference`
- `POST /api/v2/payments/initiate`
- `GET /api/v2/payments/webhook`
- `POST /api/v2/payments/webhook`
- `POST /api/v2/payments/reconcile`
- `POST /api/v2/payments/simulate`
- `GET /api/v2/tickets/download/:reference`
- `POST /api/v2/scans/validate`
- `GET /api/v2/scans/tickets/:ticketCode`

Notes d'acces :

- les lectures invitees de commande et de billets demandent `customerEmail` si l'utilisateur n'est pas connecte
- les routes de scan sont reservees aux roles `ADMIN` et `SCANNER`
- `POST /api/v2/payments/simulate` permet de tester localement le flux complet sans prestataire reel
- si `FEDAPAY_SECRET_KEY` est renseigne, `POST /api/v2/payments/initiate` utilise FedaPay par defaut et renvoie une `paymentUrl` externe
- `POST /api/v2/payments/webhook` accepte maintenant les webhooks signes FedaPay via `X-FEDAPAY-SIGNATURE`
- `POST /api/v2/payments/reconcile` permet de re-synchroniser une transaction FedaPay depuis votre backend si le retour navigateur ou le webhook a manque
- `GET /api/v2/payments/webhook` permet de verifier rapidement que votre endpoint backend est publiquement joignable

Configuration FedaPay importante :

- le webhook FedaPay doit pointer vers votre backend public, par exemple `https://votre-api-publique.exemple.com/api/v2/payments/webhook`
- n'utilisez jamais `http://localhost:5173` comme webhook : c'est une URL frontend locale, inaccessible depuis les serveurs FedaPay
- `FEDAPAY_RETURN_URL` sert au retour navigateur apres paiement, typiquement `https://votre-frontend.exemple.com/payment-return`
- si vous etes en local, exposez votre backend en `https` via un tunnel public avant de declarer l'URL webhook dans le dashboard FedaPay

Variables utiles pour FedaPay dans [backend/.env.example](backend/.env.example) :

- `FEDAPAY_SECRET_KEY`
- `FEDAPAY_ENV=sandbox|live`
- `FEDAPAY_WEBHOOK_SECRET`
- `FEDAPAY_RETURN_URL`
- `FEDAPAY_WEBHOOK_URL`
- `FEDAPAY_CALLBACK_URL` (compat legacy)
- `FEDAPAY_PHONE_COUNTRY`

Smoke test sandbox :

- `npm run smoke:fedapay:v2 --prefix backend`
- la commande cree une commande `v2`, initialise une transaction FedaPay et renvoie la `paymentUrl`
- si `FEDAPAY_SECRET_KEY` ou `FEDAPAY_WEBHOOK_SECRET` manquent, elle s'arrete avant toute creation

Ordre d'activation recommande :

1. generer ou regenera le client avec `npm run prisma:generate:v2`
2. appliquer le SQL `backend/prisma/migrations_v2/20260421143000_ticketing_core/migration.sql` sur MySQL
3. peupler les evenements et tarifs avec `npm run seed:v2`
4. brancher ensuite le frontend React sur `/api/v2`

Note :

- `npm run seed:v2` applique le seed SQL du catalogue
- `npm run seed:v2 --prefix backend` ou `npm run seed:v2:js --prefix backend` peut servir si vous voulez aussi creer un admin via `V2_ADMIN_*`

## Documentation complementaire

- [Architecture](docs/ARCHITECTURE.md)
- [Audit technique](docs/AUDIT_TECHNIQUE.md)
- [Architecture cible NestJS](docs/ARCHITECTURE_CIBLE_NESTJS.md)
- [Workflows metier](docs/WORKFLOWS_METIER.md)
# AIFUS_FINAL
