# Audit Technique AIFUS 2026

## Synthese

Etat global : MVP fonctionnel, bien avance pour une demo, mais encore perfectible avant une mise en production.

Corrections appliquees pendant cet audit :

- ajout de `autoprefixer` pour corriger le build frontend,
- correction du flux de connexion Google cote frontend,
- desactivation propre du bouton Google quand le client ID reste un placeholder,
- ajout des routes manquantes `/conditions` et `/confidentialite`,
- alignement du client Axios sur `VITE_API_BASE_URL`,
- nettoyage de `backend/.env.example`,
- validations plus coherentes sur les routes d'auth,
- suppression de classes Tailwind dynamiques critiques dans l'admin,
- base MySQL WAMP creee et migrations Prisma appliquees.

## Niveau de risque

- Critique :
  paiements encore simules, pas de prestataire reel.
- Important :
  variables sensibles a mieux gerer, pas de tests automatises.
- Moyen :
  ergonomie de certaines pages, gros bundle frontend, logique telephone a durcir.

## Audit fichier par fichier

## Racine

- `README.md`
  Etat : corrige.
  Observation : etait vide, remplace par une documentation de lancement et d'architecture.

- `frontend/README.md`
  Etat : corrige.
  Observation : le template Vite par defaut a ete remplace par une doc utile au projet.

## Frontend - coeur applicatif

- `frontend/src/main.jsx`
  Etat : corrige.
  Observation : le provider Google est maintenant active uniquement si un vrai client ID est configure.

- `frontend/src/App.jsx`
  Etat : corrige.
  Observation : le routeur est propre; deux routes manquantes ont ete ajoutees pour eviter des liens morts.

- `frontend/src/context/AuthContext.jsx`
  Etat : bon.
  Observation : gestion simple et lisible du token JWT et du profil utilisateur.
  Point de vigilance : stockage du JWT dans `localStorage`, acceptable pour un MVP mais moins robuste que des cookies httpOnly.

- `frontend/src/services/api.js`
  Etat : corrige.
  Observation : l'URL de base lit maintenant `VITE_API_BASE_URL`, ce qui aligne la config et le code.

- `frontend/src/utils/apiError.js`
  Etat : bon.
  Observation : utilitaire clair pour homogeniser les messages d'erreur Axios.

- `frontend/src/utils/constants.js`
  Etat : a nettoyer.
  Observation : fichier vide, peut etre supprime ou utilise pour centraliser les constantes metier.

## Frontend - composants

- `frontend/src/components/Layout.jsx`
  Etat : bon.
  Observation : squelette simple et coherent avec `Navbar` + `Outlet` + `Footer`.

- `frontend/src/components/Navbar.jsx`
  Etat : bon.
  Observation : navigation responsive bien structuree.
  Point de vigilance : presence de styles dark/light varies alors que la gestion explicite d'un theme n'est pas centralisee.

- `frontend/src/components/Footer.jsx`
  Etat : bon.
  Observation : contenu pertinent, mais les textes institutionnels pourraient etre externalises plus tard.

- `frontend/src/components/ProtectedRoute.jsx`
  Etat : bon.
  Observation : garde minimale et efficace.

- `frontend/src/components/AdminRoute.jsx`
  Etat : bon.
  Observation : logique claire pour restreindre l'acces admin.

- `frontend/src/components/GoogleSignInButton.jsx`
  Etat : corrige.
  Observation : remplace le flux implicite errone par `GoogleLogin`, compatible avec un retour de `credentialResponse`.

## Frontend - pages publiques

- `frontend/src/pages/Home.jsx`
  Etat : bon.
  Observation : page de presentation riche et convaincante.
  Point de vigilance : certains textes sont tres marketing et gagneraient a etre centralises.

- `frontend/src/pages/Village.jsx`
  Etat : bon.
  Observation : page vitrine propre.
  Point de vigilance : plusieurs informations restent "a confirmer" et devraient idealement venir d'une source de contenu.

- `frontend/src/pages/Gala.jsx`
  Etat : moyen.
  Observation : experience utilisateur riche, calcul du montant cote UI bien presente.
  Point de vigilance : le paiement reste simule; le composant porte beaucoup de logique et pourrait etre decoupe.

- `frontend/src/pages/Tombola.jsx`
  Etat : moyen.
  Observation : interface claire et attractive.
  Point de vigilance : meme constat que pour le gala, avec une logique metier et UI melangees.

- `frontend/src/pages/Conditions.jsx`
  Etat : ajoute.
  Observation : nouvelle page informative pour supprimer une route manquante.

- `frontend/src/pages/Confidentialite.jsx`
  Etat : ajoute.
  Observation : nouvelle page informative pour supprimer une route manquante.

## Frontend - pages d'authentification

- `frontend/src/pages/Login.jsx`
  Etat : corrige.
  Observation : parcours clair; le bouton Google utilise maintenant le bon composant.

- `frontend/src/pages/Register.jsx`
  Etat : corrige.
  Observation : bon formulaire MVP avec feedback de force du mot de passe.
  Point de vigilance : les liens vers CGU/confidentialite manquaient auparavant; c'est maintenant corrige.

- `frontend/src/pages/ForgotPassword.jsx`
  Etat : moyen.
  Observation : double parcours email / SMS interessant.
  Point de vigilance : l'etat du formulaire pourrait etre simplifie, et le parcours telephone depend d'une logique backend permissive.

- `frontend/src/pages/ResetPassword.jsx`
  Etat : bon.
  Observation : implementation simple et suffisante.

## Frontend - espace membre et admin

- `frontend/src/pages/Dashboard.jsx`
  Etat : bon.
  Observation : resume utile des donnees du membre.
  Point de vigilance : pas de gestion d'erreur riche si les appels API echouent.

- `frontend/src/pages/Admin/AdminDashboard.jsx`
  Etat : corrige.
  Observation : les classes Tailwind dynamiques ont ete remplacees par des classes explicites.

- `frontend/src/pages/Admin/Inscription.jsx`
  Etat : corrige.
  Observation : meme correction sur les badges dynamiques; structure lisible.

- `frontend/src/pages/Admin/TombolaManagement.jsx`
  Etat : bon.
  Observation : page d'administration fonctionnelle.
  Point de vigilance : usage de `alert`, a remplacer plus tard par une notification integree.

## Frontend - styles

- `frontend/src/index.css`
  Etat : moyen.
  Observation : feuille riche et ambitieuse.
  Point de vigilance : on y trouve des redondances et des definitions reappliquees (`btn-outline`, `input-field`, `label`, `badge`, `spin`), ce qui augmente le risque de collisions.

- `frontend/src/App.css`
  Etat : a evaluer.
  Observation : non utilise de maniere evidente dans le parcours principal; peut etre a nettoyer si obsolete.

## Backend - demarrage et infra

- `backend/src/server.js`
  Etat : bon.
  Observation : demarrage clair, connexion Prisma explicite.

- `backend/src/app.js`
  Etat : bon.
  Observation : composition Express simple et lisible.
  Point de vigilance : la regle CORS accepte tout sous-domaine `*.ngrok-free.dev`, ce qui doit etre borne si l'application sort du cadre de demo.

- `backend/prisma/schema.prisma`
  Etat : bon.
  Observation : schema globalement coherent avec le besoin metier.
  Point de vigilance : la table `ContactMessage` n'est pas exposee par des routes visibles dans l'application actuelle.

- `backend/prisma/migrations/*`
  Etat : bon.
  Observation : migrations appliquees avec succes sur MySQL WAMP.

## Backend - middlewares

- `backend/src/middlewares/auth.js`
  Etat : bon.
  Observation : verifie le JWT puis recharge l'utilisateur.

- `backend/src/middlewares/admin.js`
  Etat : bon.
  Observation : role gate minimal, lisible et suffisant.

- `backend/src/middlewares/validation.js`
  Etat : corrige.
  Observation : validations plus completes sur les routes d'auth; messages encore perfectibles cote UX.

- `backend/src/middlewares/errorHandler.js`
  Etat : bon.
  Observation : middleware standard, mais le code l'utilise peu car beaucoup de controllers repondent eux-memes.

## Backend - routes

- `backend/src/routes/authRoutes.js`
  Etat : corrige.
  Observation : les validations sont maintenant correctement branchees sur les endpoints oublies.

- `backend/src/routes/inscriptionRoutes.js`
  Etat : bon.
  Observation : endpoints clairs pour les inscriptions gala.
  Point de vigilance : certaines routes sont peu exploitees par le front actuel (`/gala`, `/gala/payer`).

- `backend/src/routes/tombolaRoutes.js`
  Etat : bon.
  Observation : separation propre des parcours tombola.

- `backend/src/routes/adminRoutes.js`
  Etat : bon.
  Observation : ensemble admin compact et coherent.

## Backend - controllers

- `backend/src/controllers/authController.js`
  Etat : moyen.
  Observation : couvre un perimetre large : inscription, login, reset email, reset SMS, Google auth, profil.
  Points de vigilance :
  fichier tres dense,
  recherche telephone basee sur `contains`,
  beaucoup de logique de transport (mail/SMS) dans le controller,
  certains messages de config pourraient etre centralises.

- `backend/src/controllers/inscriptionController.js`
  Etat : moyen.
  Observation : logique metier gala bien expressee.
  Points de vigilance :
  paiement direct simule,
  fallback `EMAIL_PASS || 'votre-mot-de-passe'`,
  controller long et peu factorise.

- `backend/src/controllers/tombolaController.js`
  Etat : moyen.
  Observation : logique fonctionnelle avec generation de billets uniques.
  Points de vigilance :
  paiement simule,
  generation de numeros par boucle avec verification unitaire,
  risque de concurrence si le volume augmente.

- `backend/src/controllers/adminController.js`
  Etat : bon.
  Observation : endpoints simples et efficaces pour le back-office.
  Point de vigilance : les stats agregent tout sans distinguer clairement les paiements valides/non valides dans certains totaux.

## Backend - utilitaires

- `backend/src/utils/generateToken.js`
  Etat : bon.
  Observation : utilitaire simple et clair.

- `backend/src/utils/constants.js`
  Etat : a nettoyer.
  Observation : fichier vide, candidat au nettoyage.

## Configuration et securite

- `backend/.env.example`
  Etat : corrige.
  Observation : les pseudo-secrets ont ete remplaces par des placeholders propres.

- `backend/.env`
  Etat : configure localement.
  Observation : pointe maintenant sur MySQL WAMP `aifus_festivites`.

- `frontend/.env` / `frontend/.env.example`
  Etat : acceptable.
  Observation : placeholders encore necessaires a remplacer par un vrai client ID Google pour activer la fonctionnalite.

## Recommandations prioritaires

1. Integrer un vrai prestataire de paiement pour le gala et la tombola.
2. Decouper `authController.js`, `inscriptionController.js` et `tombolaController.js` en services plus petits.
3. Durcir le reset par telephone avec une normalisation exacte du numero.
4. Ajouter des tests au minimum sur l'auth, le calcul des montants, les quotas gala et la generation des billets.
5. Nettoyer `index.css` et supprimer les fichiers `constants.js` vides.
6. Centraliser la configuration sensible et supprimer les fallbacks de mot de passe email dans le code.
7. Envisager du code splitting sur le frontend pour reduire le bundle principal.
