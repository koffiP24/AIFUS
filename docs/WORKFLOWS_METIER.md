# Workflows metier critiques

## 1. Creation de commande avec reservation temporaire

Objectif : eviter la survente.

### Flux nominal

1. le frontend appelle `POST /orders/preview` pour calculer les montants sans ecriture
2. le frontend confirme avec `POST /orders`
3. le backend ouvre une transaction MySQL
4. le backend recharge les `ticket_types` concernes et verifie les fenetres de vente
5. le backend calcule le stock disponible reel
6. le backend cree `orders`, `order_items` et `stock_reservations`
7. le backend fixe `expires_at`
8. le backend commit et retourne la reference de commande

### Regles techniques

- utiliser une transaction interactive Prisma avec un niveau d'isolation fort selon la charge, au minimum `RepeatableRead`
- verrouiller explicitement les lignes `ticket_types` critiques avec `SELECT ... FOR UPDATE`
- en cas de deadlock ou de conflit, rejouer la transaction 2 a 3 fois
- la verite du stock est calculee en base, jamais a partir du cache React

### Pseudo-code

```ts
await prisma.$transaction(async (tx) => {
  await tx.$queryRaw`
    SELECT id
    FROM ticket_types
    WHERE id IN (${Prisma.join(requestedTicketTypeIds)})
    FOR UPDATE
  `;

  const ticketTypes = await tx.ticketType.findMany({
    where: { id: { in: requestedTicketTypeIds }, isActive: true },
  });

  // Calculer la disponibilite avec les ventes payees + reservations actives non expirees.

  const order = await tx.order.create({ data: orderData });
  await tx.orderItem.createMany({ data: itemRows });
  await tx.stockReservation.createMany({ data: reservationRows });
}, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
```

## 2. Expiration de reservation

Objectif : relacher automatiquement le stock des commandes non payees.

### Flux

1. un job planifie cherche les commandes `PENDING` ou `PAYMENT_PROCESSING` dont `expires_at < now()`
2. le job passe la commande a `EXPIRED`
3. les `stock_reservations` associees passent a `EXPIRED`
4. aucune generation de billet n'est autorisee apres expiration

### Implementation

- simple cron NestJS au debut
- BullMQ des qu'il faut des retries et de la volumetrie

## 3. Initialisation du paiement

Objectif : garder une trace claire avant tout appel provider.

### Flux

1. le frontend appelle `POST /payments/initiate`
2. le backend recharge la commande et verifie qu'elle n'est ni `PAID` ni `EXPIRED`
3. le backend cree une ligne `payments` avec `INITIATED`
4. le backend appelle le provider ou prepare le payload de redirection
5. le backend met le paiement a `PENDING`
6. le backend retourne l'URL ou les donnees de paiement

### Regles

- `transaction_reference` doit etre unique
- `idempotency_key` doit etre unique si le provider le supporte
- la commande passe a `PAYMENT_PROCESSING` des qu'un paiement est lance

## 4. Webhook de paiement

Objectif : faire du webhook la seule source de verite de confirmation.

### Flux

1. le provider appelle `POST /payments/webhook`
2. le backend persiste immediatement un `payment_webhook_event`
3. le backend verifie signature, montant, reference et event provider
4. le backend retrouve la commande et le paiement
5. dans une transaction :
6. si le paiement est deja `SUCCESS`, sortie idempotente propre
7. sinon le paiement passe a `SUCCESS`
8. la commande passe a `PAID`
9. les reservations de stock passent a `CONVERTED`
10. les billets sont generes
11. si le type est tombola, les numeros uniques sont attribues
12. une notification email est queuee

### Si le webhook est absent

- le retour utilisateur ne valide jamais la commande
- un endpoint admin de reconciliation doit exister
- un job peut reinterroger le provider sur les paiements `PENDING`

## 5. Generation de billet et QR

Objectif : produire un billet unique, verifiable et sobre.

### Regles

- le QR contient `ticketCode` ou `qrToken`
- le token peut etre signe via HMAC serveur
- le backend verifie toujours en base l'existence, le statut et l'evenement
- un billet est genere uniquement apres paiement confirme

### Donnees a generer

- `ticket_code`
- `qr_token`
- PDF ou lien de telechargement securise

## 6. Scan et controle d'acces

Objectif : bloquer le double scan, meme en concurrence.

### Flux

1. l'agent scanne le QR
2. le backend decode le token
3. le backend ouvre une transaction
4. le backend verrouille la ligne ticket cible
5. le backend verifie `status`, `event_id` et `checked_in_at`
6. si le billet est deja utilise, insertion d'un `ticket_scans` avec `ALREADY_USED`
7. si le billet est annule, insertion d'un `ticket_scans` avec `CANCELLED_TICKET`
8. sinon le billet passe a `USED`
9. `checked_in_at` est renseigne
10. un `ticket_scans` avec `SUCCESS` est cree
11. commit

### Note Prisma

Prisma n'expose pas un `FOR UPDATE` haut niveau. Pour ce point precis, il est acceptable d'utiliser `tx.$queryRaw` dans la transaction pour verrouiller la ligne ticket sur MySQL 8.

## 7. Tombola

Objectif : garder un audit propre quand un achat contient beaucoup de tickets.

### Regles

- 1 ticket paye = 1 numero unique dans `raffle_tickets`
- les numeros sont attribues apres paiement `SUCCESS`
- si un client achete 50 tickets, on livre un recapitulatif groupe plutot que 50 PDFs distincts

## 8. Transitions d'etat a coder

### Commande

- `PENDING -> PAYMENT_PROCESSING`
- `PENDING -> EXPIRED`
- `PENDING -> CANCELLED`
- `PAYMENT_PROCESSING -> PAID`
- `PAYMENT_PROCESSING -> FAILED`
- `PAYMENT_PROCESSING -> EXPIRED`
- `PAID -> REFUNDED`

### Paiement

- `INITIATED -> PENDING`
- `PENDING -> SUCCESS`
- `PENDING -> FAILED`
- `PENDING -> CANCELLED`
- `SUCCESS -> REFUNDED`

### Billet

- `GENERATED -> USED`
- `GENERATED -> CANCELLED`

### Reservation

- `ACTIVE -> CONVERTED`
- `ACTIVE -> EXPIRED`
- `ACTIVE -> RELEASED`

## 9. Garde-fous minimum

- validation DTO sur toutes les entrees
- roles stricts `ADMIN`, `SCANNER`, `CUSTOMER`
- rate limiting sur auth, checkout et webhook
- audit log sur annulation billet, renvoi billet, reconciliation paiement et actions admin
- logs structures pour les paiements et les scans
