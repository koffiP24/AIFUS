# Frontend AIFUS 2026

Frontend React/Vite de la plateforme AIFUS 2026.

## Commandes

```bash
npm install
npm run dev
npm run build
npm run preview
```

Depuis la racine du repo, vous pouvez aussi utiliser :

```bash
npm run dev:frontend
npm run build:frontend
```

## Variables d'environnement

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_BASE_URL=/api
```

Notes :
- le proxy Vite redirige `/api` vers `http://localhost:5000`,
- redemarrez Vite apres toute modification de `frontend/.env`,
- la connexion Google reste desactivee tant que `VITE_GOOGLE_CLIENT_ID` contient un placeholder.

## Deploiement Vercel

Le frontend est maintenant pret pour un deploiement Vercel en mode SPA.

Reglages recommandes dans Vercel :

- Root Directory : `frontend`
- Framework Preset : `Vite`
- Build Command : `npm run build`
- Output Directory : `dist`

Variables d'environnement recommandees :

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_BASE_URL=https://your-render-service.onrender.com/api
```

Le fichier `vercel.json` gere le fallback SPA pour React Router.

## PWA mobile

Le frontend expose maintenant :

- un manifest : `public/manifest.webmanifest`
- un service worker : `public/sw.js`
- des icones d'installation : `public/pwa/*`
- une invite d'installation mobile dans l'interface

Pour tester l'installation :

- en local : `http://localhost:5173`
- sur mobile distant : servez le frontend en `https`

Sur Android, le bouton `Installer l'app` apparait quand le navigateur autorise `beforeinstallprompt`.
Sur iPhone, une consigne guide l'utilisateur vers `Partager` puis `Sur l'ecran d'accueil`.

## Documentation

Voir le README racine et les documents :

- `../README.md`
- `../docs/ARCHITECTURE.md`
- `../docs/AUDIT_TECHNIQUE.md`
