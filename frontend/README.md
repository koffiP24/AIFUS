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
- la connexion Google reste desactivee tant que `VITE_GOOGLE_CLIENT_ID` contient un placeholder.

## Documentation

Voir le README racine et les documents :

- `../README.md`
- `../docs/ARCHITECTURE.md`
- `../docs/AUDIT_TECHNIQUE.md`
