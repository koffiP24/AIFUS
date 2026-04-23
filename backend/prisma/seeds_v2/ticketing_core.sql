INSERT INTO `events` (
  `id`,
  `name`,
  `slug`,
  `type`,
  `description`,
  `venue`,
  `timezone`,
  `capacity`,
  `sale_starts_at`,
  `sale_ends_at`,
  `start_at`,
  `end_at`,
  `is_active`,
  `created_at`,
  `updated_at`
)
VALUES
(
  UUID(),
  'Gala AIFUS 2026',
  'gala-aifus-2026',
  'GALA',
  'Soiree de gala AIFUS 2026',
  'Hotel Palm Club / Sofitel',
  'Africa/Abidjan',
  300,
  '2026-04-01 00:00:00.000',
  '2026-08-01 17:00:00.000',
  '2026-08-01 18:00:00.000',
  '2026-08-02 02:00:00.000',
  true,
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'Village Ivoiro-Russe 2026',
  'village-ivoiro-russe-2026',
  'VILLAGE',
  'Village d opportunites et d echanges',
  'Abidjan',
  'Africa/Abidjan',
  2000,
  '2026-04-01 00:00:00.000',
  '2026-08-01 08:00:00.000',
  '2026-08-01 09:00:00.000',
  '2026-08-01 18:00:00.000',
  true,
  NOW(3),
  NOW(3)
),
(
  UUID(),
  'Tombola AIFUS 2026',
  'tombola-aifus-2026',
  'RAFFLE',
  'Tombola officielle AIFUS 2026',
  'Abidjan',
  'Africa/Abidjan',
  100,
  '2026-04-01 00:00:00.000',
  '2026-08-01 18:00:00.000',
  '2026-08-01 19:00:00.000',
  '2026-08-01 20:00:00.000',
  true,
  NOW(3),
  NOW(3)
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `type` = VALUES(`type`),
  `description` = VALUES(`description`),
  `venue` = VALUES(`venue`),
  `timezone` = VALUES(`timezone`),
  `capacity` = VALUES(`capacity`),
  `sale_starts_at` = VALUES(`sale_starts_at`),
  `sale_ends_at` = VALUES(`sale_ends_at`),
  `start_at` = VALUES(`start_at`),
  `end_at` = VALUES(`end_at`),
  `is_active` = VALUES(`is_active`),
  `updated_at` = NOW(3);

INSERT INTO `ticket_types` (
  `id`,
  `event_id`,
  `name`,
  `code`,
  `description`,
  `price_amount`,
  `currency`,
  `stock_total`,
  `max_per_order`,
  `requires_attendee_info`,
  `is_active`,
  `sale_starts_at`,
  `sale_ends_at`,
  `sort_order`,
  `created_at`,
  `updated_at`
)
SELECT
  UUID(),
  e.id,
  src.name,
  src.code,
  src.description,
  src.price_amount,
  src.currency,
  src.stock_total,
  src.max_per_order,
  false,
  true,
  NULL,
  NULL,
  src.sort_order,
  NOW(3),
  NOW(3)
FROM `events` e
JOIN (
  SELECT
    'gala-aifus-2026' AS event_slug,
    'Actif' AS name,
    'GALA_ACTIF' AS code,
    'Billet gala actif' AS description,
    40000 AS price_amount,
    'XOF' AS currency,
    170 AS stock_total,
    4 AS max_per_order,
    1 AS sort_order
  UNION ALL
  SELECT 'gala-aifus-2026', 'Retraite', 'GALA_RETRAITE', 'Billet gala retraite', 25000, 'XOF', 40, 4, 2
  UNION ALL
  SELECT 'gala-aifus-2026', 'Sans emploi', 'GALA_SANS_EMPLOI', 'Billet gala sans emploi', 15000, 'XOF', 10, 2, 3
  UNION ALL
  SELECT 'gala-aifus-2026', 'Invite', 'GALA_INVITE', 'Billet gala invite', 20000, 'XOF', 50, 4, 4
  UNION ALL
  SELECT 'village-ivoiro-russe-2026', 'Pass village', 'VILLAGE_PASS', 'Acces standard au village', 0, 'XOF', NULL, 10, 1
  UNION ALL
  SELECT 'tombola-aifus-2026', 'Ticket tombola', 'TOMBOLA_STD', 'Billet numerote de tombola', 10000, 'XOF', 100, 50, 1
) AS src
  ON src.event_slug = e.slug
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `description` = VALUES(`description`),
  `price_amount` = VALUES(`price_amount`),
  `currency` = VALUES(`currency`),
  `stock_total` = VALUES(`stock_total`),
  `max_per_order` = VALUES(`max_per_order`),
  `requires_attendee_info` = VALUES(`requires_attendee_info`),
  `is_active` = VALUES(`is_active`),
  `sort_order` = VALUES(`sort_order`),
  `updated_at` = NOW(3);
