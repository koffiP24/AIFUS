# Architecture AIFUS 2026

## Vue d'ensemble

Le projet suit une architecture front / API / base de donnees :

```text
React + Vite (frontend)
        |
        | HTTP / JSON
        v
Express API (backend/src/app.js)
        |
        | Prisma Client
        v
MySQL WAMP (aifus_festivites)
```

## Organisation du code

### Frontend `frontend/`

- `src/main.jsx` : point d'entree React, injection du provider d'auth et du provider Google si configure.
- `src/App.jsx` : definition des routes publiques, protegees et admin.
- `src/context/AuthContext.jsx` : etat d'authentification, stockage du token JWT, chargement du profil courant.
- `src/services/api.js` : client Axios partage.
- `src/components/` : layout, navigation, garde de routes, bouton Google.
- `src/pages/` : pages metier.

Pages principales :

- `Home.jsx` : accueil et presentation des temps forts.
- `Village.jsx` : page vitrine du village d'opportunites.
- `Gala.jsx` : parcours de reservation/paiement du gala.
- `Tombola.jsx` : achat de billets de tombola.
- `Dashboard.jsx` : vue membre connecte.
- `ForgotPassword.jsx` / `ResetPassword.jsx` : recuperation du mot de passe.
- `pages/Admin/*` : statistiques et validation admin.

### Backend `backend/`

- `src/server.js` : demarrage du serveur HTTP et connexion Prisma.
- `src/app.js` : composition Express, CORS, JSON, logs, montage des routes.
- `src/lib/prisma.js` : client Prisma partage pour centraliser l'acces a la base.
- `src/generated/prisma/` : client Prisma genere localement.
- `src/routes/` : definition des endpoints.
- `src/controllers/` : logique metier.
- `src/middlewares/` : auth JWT, role admin, validations, gestion d'erreur.
- `prisma/schema.prisma` : modele de donnees.
- `prisma/migrations/` : historique SQL Prisma.

## Flux principaux

### 1. Authentification classique

1. Le frontend envoie `POST /api/auth/register` ou `POST /api/auth/login`.
2. Le backend hash le mot de passe ou verifie le hash existant.
3. Un JWT est renvoye.
4. Le frontend stocke le token dans `localStorage`.
5. Au rechargement, `AuthContext` appelle `GET /api/auth/me`.

### 2. Authentification Google

1. Le frontend affiche `GoogleLogin` uniquement si `VITE_GOOGLE_CLIENT_ID` est reellement configure.
2. Google renvoie un `credentialResponse`.
3. Le frontend transmet `credentialResponse.credential` au backend via `POST /api/auth/google`.
4. Le backend verifie l'ID token avec `google-auth-library`.
5. Le compte est retrouve ou cree, puis un JWT applicatif est renvoye.

### 3. Gala

1. Le frontend charge les places restantes via `GET /api/inscriptions/gala/places`.
2. L'utilisateur connecte demarre une reservation.
3. Le backend calcule le montant et enregistre l'inscription.
4. Le paiement direct marque aujourd'hui l'inscription comme `VALIDE`.
5. Le dashboard et l'admin lisent l'etat de cette inscription.

### 4. Tombola

1. Le frontend choisit une quantite.
2. Le backend verifie les billets restants.
3. Des numeros uniques sont generes.
4. Les billets sont enregistres en base.
5. Le dashboard membre et l'admin recuperent ces billets.

### 5. Administration

Les routes `/api/admin/*` sont protegees par :

- `auth.js` pour l'authentification JWT,
- `admin.js` pour le role `ADMIN`.

L'interface admin permet :

- de consulter les inscriptions,
- de consulter les billets,
- de valider certains paiements,
- de consulter les totaux.

## Modele de donnees

Tables principales :

- `user`
- `passwordreset`
- `inscriptiongala`
- `billettombola`
- `contactmessage`

Relations :

- un `user` peut avoir une `inscriptiongala`,
- un `user` peut avoir plusieurs `billettombola`.

Enums Prisma :

- `Role` : `USER`, `ADMIN`
- `CategorieInscription` : `ACTIF`, `RETRAITE`, `SANS_EMPLOI`, `INVITE`
- `StatutPaiement` : `EN_ATTENTE`, `VALIDE`, `ANNULE`

## Infrastructure locale

- Frontend : `http://localhost:5173`
- Backend : `http://localhost:5000`
- Base : `mysql://root:@localhost:3306/aifus_festivites`

Le frontend parle au backend via le proxy Vite sur `/api`.

## Points d'architecture a surveiller

- Les paiements sont encore simules et non relies a un prestataire reel.
- Les emails utilisent Gmail et des variables d'environnement sensibles.
- Le reset par telephone repose sur une recherche permissive (`contains`), a durcir.
- Le token JWT est stocke dans `localStorage`, ce qui simplifie le MVP mais demande une vigilance securite.
