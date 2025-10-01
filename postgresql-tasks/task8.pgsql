UPDATE "Users"
SET balance = balance + cashback.total_cashback
FROM (
  SELECT "userId", SUM("totalAmount" * 0.1) AS total_cashback
  FROM "Orders"
  WHERE "createdAt" BETWEEN '2024-12-25' AND '2025-01-14'
  GROUP BY "userId"
) AS cashback
WHERE "Users"."id" = cashback."userId"
  AND "Users"."role" = 'customer'
RETURNING "Users".id, "Users".balance;

-- Тестовий ордер для перевірки кешбеку
  INSERT INTO "Orders" ("userId", "totalAmount", "status", "createdAt", "updatedAt")
VALUES (1, 100.00, 'completed', '2024-12-26', NOW());

