# Architecture cible React + NestJS + MySQL

## Positionnement

L'application actuelle tourne encore en mode MVP sur Express + MySQL. Ce document fixe la cible de migration vers une architecture exploitable en production sans casser l'existant pendant la transition.

## Ecarts critiques avec l'existant

- `inscriptionGala` et `billetTombola` encapsulent deux flux speciaux au lieu d'un coeur metier `orders/payments/tickets`.
- le stock repose sur des comptages de billets valides, sans reservation temporaire ni controle transactionnel fort.
- le paiement est simule, sans webhook securise, sans idempotence stricte et sans reconciliation.
- le scan du gala met a jour `checkedInAt` directement, sans journal de scan complet ni verrou explicite.
- la base MySQL actuelle peut tout a fait porter une version exploitable, a condition d'imposer MySQL 8, InnoDB, des index propres et des verrous transactionnels sur les lignes critiques.

## Stack cible

- Frontend : React, Vite, React Router, Axios, React Query, Zod, Tailwind CSS
- Backend : NestJS, Prisma, class-validator, JWT + refresh tokens
- Base : MySQL 8
- File / jobs : Redis + BullMQ des qu'on active les expirations, emails et reconciliations
- PDF / QR : `pdf-lib` ou `puppeteer`, `qrcode`

## Contraintes MySQL a imposer

- moteur InnoDB sur toutes les tables transactionnelles
- collation UTF8MB4 coherent sur toute la base
- index composites sur `status`, `expires_at`, `ticket_type_id`, `order_id`, `event_id`
- stockage `JSON` pour les payloads webhook et les metadonnees
- verrous explicites `SELECT ... FOR UPDATE` sur les lignes `ticket_types`, `orders` ou `tickets` quand on reserve, confirme ou scanne
- eviter les calculs de stock "best effort" cote application : la base reste la seule source de verite

## Principes d'architecture

- le frontend ne detient jamais la verite du stock, du paiement ou du scan
- chaque changement critique passe par une transaction backend
- les modules metier restent decoupes par responsabilite, pas par couche plate
- les integrations externes sont idempotentes et journalisees
- les reservations temporaires, les paiements et les scans sont tracables

## Arborescence NestJS cible

Si on migre progressivement, le plus propre est de construire cette structure dans un backend NestJS parallele. Si on remplace l'API actuelle d'un coup, cette arborescence devient la nouvelle base de `backend/src/`.

```text
backend/
  src/
    main.ts
    app.module.ts
    common/
      decorators/
      filters/
      guards/
      interceptors/
      pipes/
      types/
    config/
      app.config.ts
      auth.config.ts
      database.config.ts
      payment.config.ts
    infrastructure/
      prisma/
        prisma.module.ts
        prisma.service.ts
      mail/
      qr/
      pdf/
      queue/
    modules/
      auth/
        dto/
        guards/
        strategies/
        auth.controller.ts
        auth.service.ts
        auth.module.ts
      users/
      events/
      ticket-types/
      orders/
        dto/
        orders.controller.ts
        orders.service.ts
        reservations.service.ts
        pricing.service.ts
      payments/
        dto/
        payments.controller.ts
        payments.service.ts
        webhook.service.ts
        reconciliation.service.ts
      tickets/
        dto/
        tickets.controller.ts
        tickets.service.ts
        ticket-delivery.service.ts
      raffle/
      scans/
        dto/
        scans.controller.ts
        scans.service.ts
      notifications/
      admin/
      health/
    jobs/
      reservation-expiry.processor.ts
      payment-reconciliation.processor.ts
      ticket-delivery.processor.ts
```

## Modules a livrer

### `auth`

- login admin / scanner
- refresh token
- rotation et revocation des refresh tokens
- garde de roles `ADMIN`, `SCANNER`, `CUSTOMER`

### `users`

- profil utilisateur
- comptes internes
- activation / desactivation

### `events`

- creation et publication des evenements
- capacite globale
- fenetres de vente
- activation / desactivation

### `ticket-types`

- tarifs
- quotas par offre
- `max_per_order`
- parametrage tombola / gala / village

### `orders`

- preview
- creation de commande
- reservation temporaire
- expiration
- consultation par reference

### `payments`

- initialisation du paiement
- callback / webhook
- verification provider
- idempotence
- reconciliation manuelle et automatique

### `tickets`

- generation des billets apres paiement confirme
- QR token / ticket code
- PDF
- telechargement et renvoi

### `raffle`

- numeros uniques de tombola
- attribution des numeros apres paiement
- export pour tirage et audit

### `scans`

- validation QR
- blocage des doublons
- journal des scans
- controle par evenement

### `notifications`

- email de confirmation
- envoi billet
- SMS en V2 si necessaire

### `admin`

- dashboard
- suivi commandes / paiements / scans
- exports
- actions sensibles avec audit

## Contrats API cibles

### Public

- `GET /events`
- `GET /events/:slug`
- `GET /ticket-types?eventSlug=gala-2026`
- `POST /orders/preview`
- `POST /orders`
- `GET /orders/:reference`
- `POST /payments/initiate`
- `GET /payments/return/:reference`
- `GET /tickets/download/:reference`

### Auth

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### Scanner

- `POST /scans/validate`
- `GET /scans/tickets/:ticketCode`

### Admin

- `GET /admin/dashboard`
- `GET /admin/orders`
- `GET /admin/orders/:id`
- `GET /admin/participants`
- `GET /admin/tickets`
- `PATCH /admin/tickets/:id/cancel`
- `POST /admin/tickets/:id/resend`
- `PATCH /admin/events/:id`
- `PATCH /admin/ticket-types/:id`
- `POST /admin/payments/:id/reconcile`

## Regles metier a imposer

- une commande `PENDING` reserve le stock temporairement pour une duree courte, par exemple 10 minutes
- une commande `PAID` convertit les reservations en vente et declenche la generation des billets
- une commande `EXPIRED` ou `CANCELLED` relache integralement le stock
- un paiement n'est jamais valide par le frontend
- un webhook ne modifie jamais l'etat sans verification de signature, reference et montant
- un ticket deja `USED` ne peut plus etre valide une seconde fois
- le QR embarque un identifiant ou un token signe, jamais des donnees sensibles en clair

## Statuts metier cibles

### Commande

- `PENDING`
- `PAYMENT_PROCESSING`
- `PAID`
- `FAILED`
- `CANCELLED`
- `EXPIRED`
- `REFUNDED`

### Paiement

- `INITIATED`
- `PENDING`
- `SUCCESS`
- `FAILED`
- `CANCELLED`
- `REFUNDED`

### Billet

- `GENERATED`
- `USED`
- `CANCELLED`

### Scan

- `SUCCESS`
- `ALREADY_USED`
- `INVALID`
- `CANCELLED_TICKET`
- `EVENT_MISMATCH`

### Reservation de stock

- `ACTIVE`
- `CONVERTED`
- `RELEASED`
- `EXPIRED`

## Checklist de migration

1. figer la cible dans `backend/prisma/schema.mysql.prisma`
2. construire le backend NestJS en parallele de l'API Express
3. migrer d'abord le coeur `events -> ticket-types -> orders -> payments -> tickets -> scans`
4. brancher ensuite React sur les nouvelles routes de checkout et d'admin
5. desactiver les anciens flux special-cases seulement quand la generation de billets et le scan sont verifies
